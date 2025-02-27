const GITHUB_USERNAME = "tendway";
const REPO_NAME = "JS-Hoster";

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
        const contentBase64 = btoa(unescape(encodeURIComponent(e.target.result)));
        
        const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/dispatches`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                event_type: "upload-file",
                client_payload: {
                    filename: file.name,
                    content: contentBase64
                }
            })
        });

        if (response.ok) {
            status.innerHTML = `✅ Uploaded! <br> <a href="https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/uploads/${file.name}" target="_blank">View File</a>`;
        } else {
            status.innerHTML = "❌ Upload failed!";
        }
    };

    reader.readAsText(file);
}
