interface ImageProps {
  id: string;
  author: "String";
  width: number;
  height: number;
  url: string;
  download_url: string;
}
let activeImage: string | undefined = undefined;

const imageArray: ImageProps[] = [];
let randomlySortedImages;
const modal = document.getElementById("modalContainer") as HTMLDivElement;
document.addEventListener("click", handleClick);

function handleClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;

  if (target.classList.contains("closeModal")) {
    modal.classList.remove("openingModal");
    modal.classList.add("closingModal");
    activeImage = undefined;
    event.stopPropagation();
  }

  if (target.closest(".img_container")) {
    const imageId = target
      .closest(".img_container")
      ?.getAttribute("data-image_id");
    handleOpenModal(imageId as string);
    event.stopPropagation();
  }
  if (target.getAttribute("id") === "slideshow") {
    Math.floor(Math.random() * imageArray.length);
    const randomId =
      imageArray[Math.floor(Math.random() * imageArray.length)].id;
    handleOpenModal(randomId);
  }
  if (target.classList.contains("nextImg")) {
    handleNextButtonClick(activeImage as string);
  }
  if (target.classList.contains("prevImg")) {
    handlePreviousButtonClick(activeImage as string);
  }
}

async function fetchImage(pageNumber: number): Promise<void> {
  const imageUrl = `https://picsum.photos/v2/list?page=${pageNumber}`;
  const response = await fetch(imageUrl);
  const result: ImageProps[] = await response.json();
  imageArray.push(...result);
}

function displayImage(imageArray: ImageProps[]): void {
  const imageContainer = document.getElementById(
    "image_container"
  ) as HTMLDivElement;
  imageArray.forEach((image: ImageProps) => {
    const container = document.createElement("div");
    container.className =
      " img_container flex flex-col gap-2 border-2 border-gray-100 rounded-[20px] p-1 hover:shadow-xl hover:border-gray-400 hover:scale-[1.01] group transition-all duration-300 ease-in-out cursor-pointer";
    container.innerHTML = `
          <img src="${image.download_url}" alt="${image.author}" class=" rounded-2xl aspect-square object-cover" loading="lazy" />
          <div class="flex flex-row justify-between items-center px-2 py-1">
            <p class="text-base font-mono font-light">${image.author}</p>
            <span class="w-10 h-10  border border-gray-300 group-hover:border-gray-500 hover:rotate-45 transition-all ease-in-out cursor-pointer rounded-full text-2xl font-bold p-2">
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                  <path d="M6 18L18 6M18 6H10M18 6V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>
          `;
    container.addEventListener("click", handleClick);
    container.setAttribute("data-image_id", image.id);
    imageContainer.appendChild(container);
  });
}
function handleOpenModal(imageId: string): void {
  activeImage = imageId;
  modal.classList.remove("closingModal");
  modal.classList.add("openingModal");
  const image: ImageProps | undefined = imageArray.find(
    (img: ImageProps) => img.id === imageId
  );
  const modalImage = document.getElementById("modalImage") as HTMLImageElement;
  const modalAuthor = document.getElementById("author") as HTMLParagraphElement;
  modalImage.src = image?.download_url as string;
  modalAuthor.innerText = image?.author as string;
}
function handleNextButtonClick(imageId: string): void {
  console.log(activeImage);
  const currentIndex = imageArray.findIndex(
    (img: ImageProps) => img.id === imageId
  );
  const nextIndex = currentIndex + 1 < imageArray.length ? currentIndex + 1 : 0;
  const nextImage = imageArray[nextIndex];
  activeImage = nextImage.id;
  const modalImage = document.getElementById("modalImage") as HTMLImageElement;
  const modalAuthor = document.getElementById("author") as HTMLParagraphElement;
  modalImage.src = nextImage.download_url;
  modalAuthor.innerText = nextImage.author;
}
function handlePreviousButtonClick(imageId: string): void {
  const currentIndex = imageArray.findIndex(
    (img: ImageProps) => img.id === imageId
  );
  const previousIndex =
    currentIndex - 1 >= 0 ? currentIndex - 1 : imageArray.length - 1;
  const previousImage = imageArray[previousIndex];
  activeImage = previousImage.id;
  const modalImage = document.getElementById("modalImage") as HTMLImageElement;
  const modalAuthor = document.getElementById("author") as HTMLParagraphElement;
  modalImage.src = previousImage.download_url;
  modalAuthor.innerText = previousImage.author;
}

function init(): void {
  fetchImage(1).then(() => {
    const loader = document.getElementById(
      "loading_indicator"
    ) as HTMLDivElement;
    const thumbnail = document.getElementById("thumbnail") as HTMLDivElement;
    const randomIndex = Math.floor(Math.random() * imageArray.length);
    thumbnail.style.backgroundImage = `url(${imageArray[randomIndex].download_url})`;
    thumbnail.style.backgroundSize = "cover";
    thumbnail.style.backgroundPosition = "center";
    thumbnail.style.backgroundRepeat = "no-repeat";
    loader.classList.add("hidden");
    randomlySortedImages = imageArray.sort(() => Math.random() - 0.5);
    displayImage(randomlySortedImages);
  });
}

init();
