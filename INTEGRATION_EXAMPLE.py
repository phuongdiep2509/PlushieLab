"""
Integration Example: Using Image Slideshow with PDF Images

This file shows how to integrate the slideshow component into your Flask app
to display PDF page images automatically.
"""

from flask import render_template
import os
from pathlib import Path

# Example 1: Simple integration in a route
def gallery_view():
    """Display PDF images in a slideshow"""
    
    # Get all PDF images from the pdf_images folder
    pdf_images_dir = 'pdf_images'
    image_files = []
    
    if os.path.exists(pdf_images_dir):
        # Get all PNG/JPG files and sort them
        images = sorted([f for f in os.listdir(pdf_images_dir) 
                        if f.endswith(('.png', '.jpg', '.jpeg'))])
        
        # Create list with absolute paths for web
        image_files = [
            {
                'src': f'/static/pdf_images/{img}',
                'alt': f'PDF Page {images.index(img) + 1}'
            }
            for img in images
        ]
    
    return render_template(
        'slideshow_example.html',
        pdf_images=image_files
    )


# Example 2: Gallery class for better organization
class PDFGallery:
    """Helper class to manage PDF image galleries"""
    
    def __init__(self, folder_path='pdf_images'):
        self.folder_path = folder_path
        self.images = self._load_images()
    
    def _load_images(self):
        """Load all images from folder"""
        images = []
        if os.path.exists(self.folder_path):
            files = sorted([f for f in os.listdir(self.folder_path) 
                           if f.endswith(('.png', '.jpg', '.jpeg', '.gif'))])
            
            for idx, file in enumerate(files, 1):
                images.append({
                    'src': f'/static/{self.folder_path}/{file}',
                    'alt': f'Page {idx}',
                    'filename': file
                })
        
        return images
    
    def get_all(self):
        """Get all images"""
        return self.images
    
    def get_range(self, start=0, end=None):
        """Get subset of images"""
        return self.images[start:end]
    
    def get_count(self):
        """Get total image count"""
        return len(self.images)


# Example 3: Using the gallery class in a route
def pdf_viewer():
    """View with gallery helper"""
    gallery = PDFGallery('pdf_images')
    
    return render_template(
        'slideshow_example.html',
        pdf_images=gallery.get_all(),
        image_count=gallery.get_count()
    )


# Example 4: Multiple galleries
def multiple_galleries():
    """Display multiple slideshows"""
    
    gallery1 = PDFGallery('pdf_images')
    gallery2 = PDFGallery('static/pdf_images')  # Another folder
    
    return render_template(
        'multiple_galleries.html',
        gallery1_images=gallery1.get_all(),
        gallery2_images=gallery2.get_all()
    )


# Example 5: Partial/Paginated gallery
def paginated_gallery(page=1, per_page=10):
    """Show images in paginated slideshows"""
    
    gallery = PDFGallery('pdf_images')
    total = gallery.get_count()
    
    start = (page - 1) * per_page
    end = start + per_page
    
    images = gallery.get_range(start, end)
    
    return render_template(
        'slideshow_example.html',
        pdf_images=images,
        page=page,
        total_pages=(total + per_page - 1) // per_page
    )


# Example 6: Template usage
"""
In your template file (e.g., template_name.html):

{% extends "base.html" %}

{% block content %}
  <div style="max-width: 900px; margin: 0 auto; padding: 40px 20px;">
    <h1>Document Preview</h1>
    
    <!-- Include the slideshow component -->
    {% include "components/slideshow.html" with 
       slideshow_id="pdf-document",
       images=pdf_images
    %}
    
    <div style="margin-top: 30px;">
      <p>Total pages: {{ image_count }}</p>
    </div>
  </div>
{% endblock %}
"""


# Example 7: Advanced - Search and filter
class AdvancedGallery:
    """Advanced gallery with filtering"""
    
    def __init__(self, folder_path='pdf_images'):
        self.folder_path = folder_path
        self.images = self._load_images()
    
    def _load_images(self):
        """Load images with metadata"""
        images = []
        if os.path.exists(self.folder_path):
            files = sorted(os.listdir(self.folder_path))
            for idx, file in enumerate(files, 1):
                path = os.path.join(self.folder_path, file)
                images.append({
                    'src': f'/static/{self.folder_path}/{file}',
                    'alt': f'Page {idx}',
                    'filename': file,
                    'size': os.path.getsize(path),
                    'page_number': idx,
                    'type': Path(file).suffix.lower()
                })
        return images
    
    def filter_by_type(self, file_type):
        """Filter images by type (.png, .jpg, etc.)"""
        return [img for img in self.images if img['type'] == file_type]
    
    def search(self, query):
        """Search images by filename"""
        return [img for img in self.images if query.lower() in img['filename'].lower()]
    
    def get_pages(self, start_page, end_page):
        """Get specific page range"""
        return [img for img in self.images 
                if start_page <= img['page_number'] <= end_page]


# Example 8: Complete Flask route
"""
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/gallery')
def show_gallery():
    gallery = PDFGallery('pdf_images')
    return render_template(
        'slideshow_example.html',
        pdf_images=gallery.get_all(),
        title='My PDF Gallery'
    )

@app.route('/gallery/filtered/<file_type>')
def filtered_gallery(file_type):
    gallery = AdvancedGallery('pdf_images')
    images = gallery.filter_by_type(f'.{file_type}')
    return render_template(
        'slideshow_example.html',
        pdf_images=images,
        title=f'Gallery - {file_type.upper()} Files'
    )

if __name__ == '__main__':
    app.run(debug=True)
"""


if __name__ == '__main__':
    # Test the gallery class
    gallery = PDFGallery('pdf_images')
    print(f"Found {gallery.get_count()} images")
    print(f"First 3 images: {gallery.get_range(0, 3)}")
