const GITHUB_USERNAME = "tendway";
const REPO_NAME = "JS-Hoster";
const TOKEN = "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"; 

function updateFileName() {
    const fileInput = document.getElementById("fileInput");
    const fileName = document.getElementById("fileName");
    fileName.innerText = fileInput.files.length ? fileInput.files[0].name : "No file selected";
}

async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const status = document.getElementById("status");

    if (!fileInput.files.length) {
        status.innerHTML = "❌ Select a file!";
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async function (e) {
        const contentBase64 = btoa(e.target.result);

        const filePath = `uploads/${file.name}`;
        const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${filePath}`;

        // Проверяем, существует ли файл
        let sha = null;
        const checkResponse = await fetch(url, {
            headers: { Authorization: `token ${TOKEN}` }
        });

        if (checkResponse.ok) {
            const fileData = await checkResponse.json();
            sha = fileData.sha;
        }

        // Загружаем файл в репозиторий
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `token ${TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `Upload ${file.name}`,
                content: contentBase64,
                sha: sha
            })
        });

        if (response.ok) {
            status.innerHTML = `✅ Uploaded! <br> <a href="https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/uploads/${file.name}" target="_blank">View File</a>`;
        } else {
            status.innerHTML = "❌ Upload failed!";
        }
    };

    reader.readAsBinaryString(file);
}
