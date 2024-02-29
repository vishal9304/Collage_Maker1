function generateCollage() {
    const collageOption = document.getElementById("collage-options").value;
    const files = document.getElementById("image-upload").files;
    if (files.length === 0) {
      alert("Please select at least one image.");
      return;
    }
  
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    const imagePromises = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
  
      imagePromises.push(new Promise((resolve, reject) => {
        reader.onload = function(event) {
          const image = new Image();
          image.src = event.target.result;
          image.onload = function() {
            resolve(image);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }));
    }
  
    Promise.all(imagePromises).then(images => {
      const collageResult = document.getElementById("collage-result");
      collageResult.innerHTML = '';
  
      if (collageOption === "grid") {
        const rows = Math.ceil(Math.sqrt(images.length));
        const cols = Math.ceil(images.length / rows);
        canvas.width = cols * 200;
        canvas.height = rows * 200;
  
        let x = 0;
        let y = 0;
  
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          ctx.drawImage(image, x, y, 200, 200);
          x += 200;
          if (x >= canvas.width) {
            x = 0;
            y += 200;
          }
        }
      } else if (collageOption === "horizontal") {
        const totalWidth = images.length * 200;
        const containerWidth = document.querySelector('.container').clientWidth - 40;
        const scaleRatio = Math.min(1, containerWidth / totalWidth);
        canvas.width = totalWidth * scaleRatio;
        canvas.height = 200;
  
        let x = 0;
  
        images.forEach(image => {
          ctx.drawImage(image, x, 0, 200 * scaleRatio, 200);
          x += 200 * scaleRatio;
        });
      } else if (collageOption === "vertical") {
        canvas.width = 200;
        canvas.height = images.length * 200;
  
        let y = 0;
  
        images.forEach(image => {
          ctx.drawImage(image, 0, y, 200, 200);
          y += 200;
        });
      } /*else if (collageOption === "random") {
        const containerWidth = document.querySelector('.container').clientWidth - 40;
        const containerHeight = window.innerHeight - 220;
  
        canvas.width = containerWidth;
        canvas.height = containerHeight;
  
        const imageWidth = 200;
        const imageHeight = 200;
  
        const padding = 10;
        const cols = Math.floor(containerWidth / (imageWidth + padding));
        const rows = Math.floor(containerHeight / (imageHeight + padding));
        const totalImages = cols * rows;
  
        let count = 0;
  
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            if (count >= images.length) break;
            const x = j * (imageWidth + padding);
            const y = i * (imageHeight + padding);
            ctx.drawImage(images[count], x, y, imageWidth, imageHeight);
            count++;
          }
          if (count >= images.length) break;
        }
      }*/
  
      collageResult.appendChild(canvas);
      const downloadLink = document.createElement("a");
      downloadLink.href = canvas.toDataURL("image/png");
      downloadLink.download = "collage.png";
      downloadLink.textContent = "Download Collage";
      collageResult.appendChild(downloadLink);
    }).catch(error => {
      console.error('Error generating collage:', error);
      alert('Error generating collage. Please try again.');
    });
  }
  