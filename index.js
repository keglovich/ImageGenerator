const APIkey = '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';
const maxImages = 4;

function getRandomNumber(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

function disableGenerateButton() {
   document.getElementById('generate').diabled = true;
}

function enableGenerateButton() {
   document.getElementById('generate').diabled = false;
}

function clearImageGrid() {
   const imageGrid = document.getElementById('image-grid');
   imageGrid.innerHTML = '';
}

async function generateImages(input) {
   disableGenerateButton();
   clearImageGrid();

   const loading = document.getElementById('loading');
   loading.style.display = 'flex';

   const imageUrls = [];

   for (let i = 0; i < maxImages; i++) {
      const randomNumber = getRandomNumber(1, 1000);
      const prompt = `${input} ${randomNumber}`;

      const response = await fetch(
         'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
         {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${APIkey}`,
            },
            body: JSON.stringify({ inputs: prompt }),
         }
      );

      if (!response.ok) {
         alert('Failed to generate image!');
      }

      const blob = await response.blob();
      const imgUrl = URL.createObjectURL(blob);
      imageUrls.push(imgUrl);

      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = `art-${i + 1}`;
      img.onclick = () => downloadImage(imgUrl, i);
      document.getElementById('image-grid').appendChild(img);
   }

   loading.style.display = 'none';
   enableGenerateButton();

   selectImageNumber = null;
}

document.getElementById('generate').addEventListener('click', () => {
   const input = document.getElementById('user-prompt').value;
   generateImages(input);
});

function downloadImage(imgUrl, imageNumber) {
   const link = document.createElement('a');
   link.href = imgUrl;
   link.download = `image-${imageNumber + 1}.jpg`;
   link.click();
}
