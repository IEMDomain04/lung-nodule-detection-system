import os
import torch
import numpy as np
from PIL import Image
from torch.utils.data import Dataset
import SimpleITK as sitk

# ============================================================================
# CUSTOM DATASET CLASS
# ============================================================================
class NoduleDataset(Dataset):
    def __init__(self, dataframe, images_dir, transform=None):
        self.df = dataframe.reset_index(drop=True)
        self.images_dir = images_dir
        self.transform = transform
        
    def __len__(self):
        return len(self.df)
    
    def __getitem__(self, idx):
        row = self.df.iloc[idx]
        img_path = os.path.join(self.images_dir, row['img_name'])
        
        # Load .mha image
        image = sitk.ReadImage(img_path)
        img_array = sitk.GetArrayFromImage(image)
        
        # Handle different array shapes
        if len(img_array.shape) == 3:
            img_array = img_array[0]  # Take first slice if 3D
        
        # Normalize to 0-255 range
        img_array = img_array.astype(np.float32)
        img_min, img_max = img_array.min(), img_array.max()
        if img_max > img_min:
            img_array = ((img_array - img_min) / (img_max - img_min) * 255).astype(np.uint8)
        else:
            img_array = np.zeros_like(img_array, dtype=np.uint8)
        
        # Convert to 3-channel (RGB) for ViT
        img_array = np.stack([img_array, img_array, img_array], axis=-1)
        
        # Convert to PIL Image for transforms
        from PIL import Image
        image = Image.fromarray(img_array)
        
        if self.transform:
            image = self.transform(image)
        
        label = torch.tensor(row['label'], dtype=torch.long)
        
        return image, label