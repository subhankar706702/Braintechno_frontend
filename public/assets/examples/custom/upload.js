async function handleFileUploadClick(item) {
    const dropArea = document.querySelector(".drop_box"),
        button = dropArea.querySelector("button"),
        dragText = dropArea.querySelector("header"),
        input = dropArea.querySelector("input");
    msgContainer = dropArea.querySelector("#msg-container");
    var fileName;

    input.click();


    input.addEventListener("change", (e) => {

        fileName = e.target.files[0].name;

        // var data = new FormData();
        // data.append('file', file.attachments[0]);
        fetch('https://swqbq3ugnk.execute-api.ap-south-1.amazonaws.com/Prod/presignedurl?accountId=130&filename=' + fileName, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response
            } else {
                var error = new Error(response.statusText)
                error.response = response
                throw error
            }
        }).then(response => {
            return response.json()
        }).then(data => {
            fetch(data.url, {
                method: 'PUT',
                body: e.target.files[0],
                headers: {
                    'Accept': 'application/json'
                },
            }).then(uploadResponse => {
                // dropArea.innerHTML = '<h4>Uploaded successfully</h4>'
                msgContainer.innerHTML = `<h4><span style="font-weight: 600">${fileName}</span>- Uploaded successfully</h4>`;
            })
                .catch((error) => {
                    console.log(error);
                    msgContainer.innerHTML += `<h4><span style="font-weight: 600">${fileName}</span>- Upload failed</h4>`;
                });
        })
            .catch((error) => {
                console.log(error);
                msgContainer.innerHTML += `<h4><span style="font-weight: 600">${fileName}</span>- Upload failed</h4>`;
            });



    });

}

let documentArray = [];

async function handleMultiFileUploadClick(items) {
    const dropAreaMulti = document.querySelector(".drop_box_multi"),
        button = dropAreaMulti.querySelector("button"),
        dragText = dropAreaMulti.querySelector("header"),
        input = dropAreaMulti.querySelector("input");
    msgContainer = dropAreaMulti.querySelector("#msg-container");
    msgContainerUpload = dropAreaMulti.querySelector("#msg-container-upload");

    input.click();

    function upload(idx, file) {
        msgContainerUpload.innerHTML = `<div>Uploading...</div>`
        let fileName = file.name;
        fetch('https://swqbq3ugnk.execute-api.ap-south-1.amazonaws.com/Prod/presignedurl?accountId=130&filename=' + fileName, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response
            } else {
                var error = new Error(response.statusText)
                error.response = response
                throw error
            }
        }).then(response => {
            return response.json()
        }).then(data => {
            fetch(data.url, {
                method: 'PUT',
                body: file,
                headers: {
                    'Accept': 'application/json'
                },
            }).then(uploadResponse => {
                input.removeEventListener("change", uploadClick);
                documentArray.push({
                    documentOriginalName: file.name,
                    documentSize: file.size,
                    documentName: file.name,
                    fileType: "application/" + file.name.substring(file.name.lastIndexOf('.') + 1),
                    path: uploadResponse.url,
                    extension: file.name.substring(file.name.lastIndexOf('.') + 1),
                });
                console.log("upload Data=", documentArray);
                msgContainer.innerHTML += `<div style="display: flex; align-items: baseline"><h4><span style="font-weight: 600">${fileName}</span>- Uploaded successfully</h4><div style="margin-left: 16px" class="check"></div></div>`;
                msgContainerUpload.innerHTML = ``
            })
                .catch((error) => {
                    console.log(error);
                    input.removeEventListener("change", uploadClick);
                    msgContainer.innerHTML += `<h4><span style="font-weight: 600">${fileName}</span>- Upload failed</h4>`;
                    msgContainerUpload.innerHTML = ``
                });
        })
            .catch((error) => {
                console.log(error);
                msgContainer.innerHTML += `<h4><span style="font-weight: 600">${fileName}</span>- Upload failed</h4>`;
                msgContainerUpload.innerHTML = ``
            });

    }

    function uploadClick(e) {

        fileName = e.target.files[0].name;

        for (let i = 0; i < e.target.files.length; i++) {
            upload(i, e.target.files[i]);
        }
    }

    input.addEventListener("change", uploadClick);

};

function getPlaceHolderText(item) {
    // const dropdown = document.querySelector(".place_holder_wrapper select");
    var e = document.getElementById("placeHolder_select");
    var value = e.options[e.selectedIndex].value;
    // var text = e.options[e.selectedIndex].text;
    document.getElementById('placeholderTextArea').value = document.getElementById("placeholderTextArea").value + '' + value;
}


function gt(item) {

    var firstName = document.getElementById("first_name").value;
    var lastName = document.getElementById("last_name").value;
    var email = document.getElementById("email").value;
    var file = document.getElementById("fileID").value;
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get('templateId');
    console.log("TemplateIds=", templateId);
    
    if (firstName == "" || email == "" || file == []) {
        alert("Please Provide First name ,Email, Document.");
        return false;
    } else {
        let data = {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "templateId": templateId,
            "documents": documentArray
        }
        fetch('https://dev.popularbano.com/api/autorecommendeddeal/addEmailContact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(
                console.log(data));
                alert("Upload Succesfully");
                data => (data)
            .catch(error => console.error(error));
    }
}



function uploadForm(item) {
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var phone_no = document.getElementById("phone_no").value;
    var email = document.getElementById("email").value;
    var location = document.getElementById("location").value;
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get('templateId');
    console.log("TemplateIds=", templateId);

    if (firstName == "" ||lastName==''|| email == "") {
        alert("Please Provide First name, Last name, Email.");
        return false;
    }
    else {
        let data = {
            "firstName": firstName,
            "lastName": lastName,
            "phone_no": phone_no,
            "email": email,
            "location": location,
            "templateId": '642acf2b3d44b8300cc9ef28',
            "documents": [],
            // "accountId":"1042"
        }
        fetch('https://dev.popularbano.com/api/autorecommendeddeal/addEmailContact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(
                alert("Upload Succesfully"),
                data => console.log(data))
            .catch(error => console.error(error));
    }
}




