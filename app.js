const saveImg = document.querySelector(".box-control__row-save");
const resetButton = document.querySelector(".box-control__reset");
const fileInput = document.querySelector(".box-control__row-file");
const previewImg = document.querySelector(".box-content__img img");
const chooseImg = document.querySelector(".box-control__row-choose");
const filterSlider = document.querySelector(
  ".box-content__panel-filter__slider input"
);
const filterName = document.querySelector(
  ".box-content__panel-filter__slider-info__name"
);
const filterValue = document.querySelector(
  ".box-content__panel-filter__slider-info__value"
);
const filterRotate = document.querySelectorAll(
  ".box-content__panel-rotate__options button"
);
const filterOption = document.querySelectorAll(
  ".box-content__panel-filter__options button"
);

let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayScale = 0,
  rotate = 0,
  flipHorizantal = 1,
  flipVertical = 1;

const applyFilter = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizantal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayScale}%)`;
};

const loadImg = () => {
  let file = fileInput.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    document.querySelector(".box").classList.remove(".disabled");
  });
};

filterOption.forEach((option) => {
  option.addEventListener("click", () => {
    filterOption.forEach((h) => h.classList.remove("active-btn"));
    option.classList.add("active-btn");
    filterName.innerText = option.innerText;

    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    }
    if (option.id === "inversion") {
      filterSlider.max = "100";

      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";

      filterSlider.value = grayScale;
      filterValue.innerText = `${grayScale}%`;
    }
  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectFilter = document.querySelector(
    ".box-content__panel-filter__options .active-btn"
  );

  if (selectFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayScale = filterSlider.value;
  }
  applyFilter();
};

filterRotate.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizantal") {
      flipHorizantal = flipHorizantal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilter();
  });
});

const resetItems = () => {
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayScale = 0;
  rotate = 0;
  flipHorizantal = 1;
  flipVertical = 1;
  filterOption[0].click();
  applyFilter();
};

const saveData = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = previewImg.naturalWidth;
  canvas.height = previewImg.naturalHeight;

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayScale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flipHorizantal, flipVertical);
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const link = document.createElement("a");
  link.download = "image.png";
  link.href = canvas.toDataURL();
  link.click();
};

fileInput.addEventListener("change", loadImg);
filterSlider.addEventListener("input", updateFilter);
resetButton.addEventListener("click", resetItems);
saveImg.addEventListener("click", saveData);
chooseImg.addEventListener("click", () => fileInput.click());
