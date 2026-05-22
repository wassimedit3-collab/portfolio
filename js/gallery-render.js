// Gallery renderer — builds gallery HTML from imagesData
function renderGallery(containerId, categoryId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const images = categoryImages[categoryId];
  if (!images) return;
  images.forEach(function(img) {
    var item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML =
      '<div class="gallery-thumb">' +
        '<img src="assets/images/' + categoryId + '/' + img.file + '" alt="Portfolio image — ' + img.label + '" loading="lazy" class="gallery-thumb-img">' +
      '</div>' +
      '<div class="gallery-caption">' + img.label + '</div>';
    container.appendChild(item);
  });
}

function renderSelectedWorkPreview(containerId, count) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var limit = count || selectedWorkImages.length;
  var images = selectedWorkImages.slice(0, limit);
  images.forEach(function(img) {
    var item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML =
      '<div class="gallery-thumb">' +
        '<img src="assets/images/selected-work/' + img.file + '" alt="Portfolio image — ' + img.label + '" loading="lazy" class="gallery-thumb-img">' +
      '</div>' +
      '<div class="gallery-caption">' + img.label + '</div>';
    container.appendChild(item);
  });
}

function setCategoryCover(cardElement, categoryId) {
  var cover = categoryCoverImages[categoryId];
  if (!cover) return;
  cardElement.style.backgroundImage = 'url(assets/images/' + categoryId + '/' + cover + ')';
  cardElement.style.backgroundSize = 'cover';
  cardElement.style.backgroundPosition = 'center';
  cardElement.style.position = 'relative';
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.65);z-index:0;pointer-events:none';
  cardElement.appendChild(overlay);
  var info = cardElement.querySelector('.category-info');
  if (info) info.style.position = 'relative';
  if (info) info.style.zIndex = '1';
  if (info) info.style.background = 'transparent';
  if (info) info.style.padding = '20px';
}
