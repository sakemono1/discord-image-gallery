const gallery = document.getElementById("gallery");
const search = document.getElementById("search");

let images = [];

async function loadImages() {
    try {
        const response = await fetch("images.json");
        images = await response.json();

        // 첫 번째 명령어를 기준으로 가나다순 정렬
        images.sort((a, b) =>
            a.commands[0].localeCompare(b.commands[0], "ko")
        );

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

        // 이미지 영역
        const imageWrap = document.createElement("div");
        imageWrap.className = "image-wrap";

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.commands.join(", ");

        // 마우스오버 시 표시할 명령어 목록
        const overlay = document.createElement("div");
        overlay.className = "command-overlay";

        item.commands.forEach(cmd => {
            const line = document.createElement("div");
            line.textContent = "~" + cmd;
            overlay.appendChild(line);
        });

        imageWrap.appendChild(img);
        imageWrap.appendChild(overlay);

        // 카드 하단 정보
        const info = document.createElement("div");
        info.className = "card-info";

        const title = document.createElement("p");
        title.textContent = item.commands[0];

        const commandLabel = document.createElement("span");
        commandLabel.textContent = "~" + item.commands[0];

        info.appendChild(title);
        info.appendChild(commandLabel);

        card.appendChild(imageWrap);
        card.appendChild(info);

        // 클릭하면 첫 번째 명령어 복사
        card.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(
                    "~" + item.commands[0]
                );

                commandLabel.textContent = "복사 완료!";

                setTimeout(() => {
                    commandLabel.textContent = "~" + item.commands[0];
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
