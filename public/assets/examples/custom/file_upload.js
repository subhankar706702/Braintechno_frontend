unlayer.registerTool({
    name: 'file_upload',
    label: 'File Upload',
    icon: 'fa-upload',
    supportedDisplayModes: ['web', 'email'],
    options: {
      default: { title: null, options: {} },
      fields: {
          position: 1,
          title: "Form1",
          options: {
              action: { label: "Submit Action", defaultValue: { method: "GET", target: "_self", url: "" }, widget: "form_action" },
              fields: { label: "Fields", defaultValue: [{ name: "email", type: "email", label: "Email", placeholder_text: "Enter email here", show_label: !0, required: !0 }], widget: "fields" },
              fieldBorder: {
                  label: "Border",
                  defaultValue: {
                      borderTopWidth: "1px",
                      borderTopStyle: "solid",
                      borderTopColor: "#CCC",
                      borderLeftWidth: "1px",
                      borderLeftStyle: "solid",
                      borderLeftColor: "#CCC",
                      borderRightWidth: "1px",
                      borderRightStyle: "solid",
                      borderRightColor: "#CCC",
                      borderBottomWidth: "1px",
                      borderBottomStyle: "solid",
                      borderBottomColor: "#CCC",
                  },
                  widget: "border",
                  hidden: !0,
              },
              fieldBorderRadius: { label: "Rounded Border", defaultValue: "0px", widget: "border_radius", hidden: !0 },
              fieldPadding: { label: "Padding", defaultValue: "10px", widget: "padding", hidden: !0 },
              fieldBackgroundColor: { label: "Background Color", defaultValue: "#FFF", widget: "color_picker", hidden: !0 },
              fieldColor: { label: "Text Color", defaultValue: "#000", widget: "color_picker", hidden: !0 },
              fieldFontSize: { label: "Font Size", defaultValue: "12px", widget: "font_size", overrideAllowed: ["mobile"], hidden: !0 },
          },
      },
      layout: {
          position: 2,
          title: "Layout",
          options: {
              formWidth: { label: "Form Width", defaultValue: { autoWidth: !1, width: "100%" }, widget: "auto_width", overrideAllowed: ["mobile"] },
              formAlign: { label: "Form Alignment", defaultValue: "center", widget: "alignment", overrideAllowed: ["mobile"] },
              fieldDistance: { label: "Space Between Fields", defaultValue: "10px", widget: "px" },
          },
      },
      labels: {
          position: 3,
          title: "Labels",
          options: {
              labelFontSize: { label: "Font Size", defaultValue: "14px", widget: "font_size", overrideAllowed: ["mobile"] },
              labelColor: { label: "Color", defaultValue: "#444", widget: "color_picker" },
              labelAlign: { label: "Alignment", defaultValue: "left", widget: "alignment", overrideAllowed: ["mobile"] },
              labelPadding: { label: "Padding", defaultValue: "0px 0px 3px", widget: "padding", hidden: !0 },
          },
      },
      button: {
          position: 4,
          title: "Button",
          options: {
              buttonText: { label: "Text", defaultValue: "Submit", widget: "text" },
              buttonColors: { label: "Color", defaultValue: { color: "#FFF", backgroundColor: "#3AAEE0", hoverColor: "#FFF", hoverBackgroundColor: "#3AAEE0" }, widget: "button_color" },
              buttonAlign: { label: "Alignment", defaultValue: "center", widget: "alignment", overrideAllowed: ["mobile"] },
              buttonWidth: { defaultValue: { autoWidth: !1, width: "100%" }, label: "Width", widget: "auto_width", overrideAllowed: ["mobile"] },
              buttonFontSize: { label: "Font Size", defaultValue: "14px", widget: "font_size", overrideAllowed: ["mobile"], hidden: !0 },
              buttonBorder: { label: "Border", defaultValue: {}, widget: "border", hidden: !0 },
              buttonBorderRadius: { label: "Rounded Border", defaultValue: "4px", widget: "border_radius", hidden: !0 },
              buttonPadding: { label: "Padding", defaultValue: "10px", widget: "padding", hidden: !0 },
              buttonMargin: { label: "Margin", defaultValue: "5px 0px 0px", widget: "margin", hidden: !0 },
          },
      },
  },
    values: {},
    renderer: {
        Viewer: unlayer.createViewer({
            render(values) {
                return `<div class="file_upload_${values._meta.htmlID}">

                <div class="container">
                <div class="card">
                  <h3>Upload Files</h3>
                  <div class="drop_box">
                    <header>
                      <h4>Select File here</h4>
                    </header>
                    <p>Files Supported: PDF, TEXT, DOC , DOCX, JPEG, JPG, PNG</p>
                    <input type="file" hidden accept=".doc,.docx,.pdf,.jpeg,.png,.jpg" id="fileID" style="display:none;">
                    <button class="btn">Choose1 File</button>
                  </div>
              
                </div>
              </div>

                    </div>`;
            },
        }),
        exporters: {
            web: function (values) {
                return `<div class="file_upload_${values._meta.htmlID}" >
                
                <div class="container">
                <div class="card">
                  <h3>Upload one File</h3>
                  <div class="drop_box">
                    <header>
                      <h4>Select File here</h4>
                    </header>
                    <p>Files Supported: PDF, TEXT, DOC , DOCX, JPEG, JPG, PNG</p>
                    <input type="file" hidden accept=".doc,.docx,.pdf,.jpeg,.png,.jpg" id="fileID" style="display:none;">
                    <button class="btn"  onclick="handleFileUploadClick(this)">Choose File</button>
                    <div id="msg-container" style="margin-top: 10px"></div>
                  </div>
              
                </div>
              </div>




                         </div>`;
            },
            email: function (values) {
                return '<div>I am a custom tool.</div>';
            },
        },
        head: {
            css: function (values) {
                return `
               
                .file_upload_${values._meta.htmlID} .container {
                   
                    width: 100%;
                    align-items: center;
                    display: flex;
                    justify-content: center;
                    background-color: #fcfcfc;
                  }
                  
                  .file_upload_${values._meta.htmlID} .card {
                    border-radius: 10px;
                    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
                    width: 600px;
                    background-color: #ffffff;
                    padding: 10px 30px 40px;
                  }
                  
                  .file_upload_${values._meta.htmlID} .card h3 {
                    font-size: 22px;
                    font-weight: 600;
                    
                  }
                  
                  .file_upload_${values._meta.htmlID} .drop_box {
                    margin: 10px 0;
                    padding-bottom: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    border: 3px dotted #a3a3a3;
                    border-radius: 5px;
                  }
                  
                  .file_upload_${values._meta.htmlID} .drop_box h4 {
                    font-size: 16px;
                    font-weight: 400;
                    color: #2e2e2e;
                  }
                  
                  .file_upload_${values._meta.htmlID} .drop_box p {
                    margin-top: 10px;
                    margin-bottom: 20px;
                    font-size: 12px;
                    color: #a3a3a3;
                  }
                  
                  .file_upload_${values._meta.htmlID} .btn {
                    text-decoration: none;
                    background-color: #005af0;
                    color: #ffffff;
                    padding: 10px 20px;
                    border: none;
                    outline: none;
                    transition: 0.3s;
                  }
                  
                  .file_upload_${values._meta.htmlID} .btn:hover{
                    text-decoration: none;
                    background-color: #ffffff;
                    color: #005af0;
                    padding: 10px 20px;
                    border: none;
                    outline: 1px solid #010101;
                  }
                  .file_upload_${values._meta.htmlID} .form input {
                    margin: 10px 0;
                    width: 100%;
                    background-color: #e2e2e2;
                    border: none;
                    outline: none;
                    padding: 12px 20px;
                    border-radius: 4px;
                  }
          `
            },
            js: function (values) {
                return `
                async function handleFileUploadClick(item){ 
                    const dropArea = document.querySelector(".drop_box"),
  button = dropArea.querySelector("button"),
  dragText = dropArea.querySelector("header"),
  input = dropArea.querySelector("input");
  msgContainer = dropArea.querySelector("#msg-container");
let file;
var filename;
var fileName;
                    
                    input.click();


                    input.addEventListener("change", (e)=> {
                         
                        fileName = e.target.files[0].name;

                        // var data = new FormData();
                        // data.append('file', file.attachments[0]);
                         fetch('https://swqbq3ugnk.execute-api.ap-south-1.amazonaws.com/Prod/presignedurl?accountId=130&filename='+fileName, {
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
                            msgContainer.innerHTML  = '<h4>Uploaded successfully</h4>';
                          })
                        })



                      });
          
                  }
                
                `
            },
        },
    },
});