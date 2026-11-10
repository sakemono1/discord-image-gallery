const gallery = document.getElementById("gallery");
const search = document.getElementById("search");

let images = [];

async function loadImages() {
    try {
        const response = await fetch("images.json");
        images = await response.json();
        renderGallery(images);
    } catch (error) {
        gallery.textContent = "이미지 목록을 불러오지 못했습니다...";
        console.error(error);
    }
}

function renderGallery(list) {
    gallery.innerHTML = "";

    list.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.commands.join(", ");

        const info = document.createElement("div");
        info.className = "card-info";

        const title = document.createElement("p");
        title.textContent = item.commands[0];

        const command = document.createElement("span");
        command.textContent = "~" + item.commands[0];

        info.appendChild(title);
        info.appendChild(command);

        card.appendChild(img);
        card.appendChild(info);

        card.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(
                    "~" + item.commands[0]
                );
                command.textContent = "복사 완료!";
                setTimeout(() => {
                    command.textContent = "~" + item.commands[0];
                }, 1200);
            } catch (error) {
                console.error("복사 실패:", error);
            }
        });

        gallery.appendChild(card);
    });
}

search.addEventListener("input", () => {
    const keyword = search.value.toLowerCase();

    const filtered = images.filter(item =>
        item.commands.some(command =>
            command.toLowerCase().includes(keyword)
        )
    );

    renderGallery(filtered);
});

loadImages();
