tinymce.init({
    selector: 'textarea.textDoc', // Initialize TinyMCE on textareas with the class 'textDoc'
    plugins: 'image',
    file_picker_callback: (cb, value, meta) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const id = 'blobid' + (new Date()).getTime();
          const blobCache = tinymce.activeEditor.editorUpload.blobCache;  // cấu hình tinymce để có thể up ảnh ở phần mô tả
          const base64 = reader.result.split(',')[1];
          
          const blobInfo = blobCache.create(id, file, base64);
          blobCache.add(blobInfo);
  
          cb(blobInfo.blobUri(), { title: file.name });
        });
        
        reader.readAsDataURL(file);
      });
  
      input.click();
    }
  });
  