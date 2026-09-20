unlayer.registerTool({
    name: 'rating',
    label: 'Rating',
    icon: 'https://braintechnodesignfiles.s3.ap-south-1.amazonaws.com/130/designdocument/75d8544e-3eef-4cda-9a30-4268a3812dd9.png',
    supportedDisplayModes: ['web', 'email'],
    options: {
      default: {
        title: null,
      },
      text: {
        title: 'LABELS',
        position: 1,
        options: {
          textColor: {
            label: 'Color',
            defaultValue: '#5C5C5C',//'#ff0000',#aaa
            widget: 'color_picker', // built_in property editor
          },
  
          backgroundColor: {
            label: 'Background Color',
            defaultValue: '#fff',//'#ff0000',#f2b600
            widget: 'color_picker', // built_in property editor
          },
          placeholderColor: {
            label: 'Placeholder Color',
            defaultValue: '#8D8D8D',//'#ff0000',#aaa
            widget: 'color_picker', // built_in property editor
          },
          textAlign: {
            label: 'Align',
            defaultValue: 'left',
            widget: 'alignment'
          },
        },
      },
      button: {
        position: 2,
        title: "Button",
        options: {
          buttonBackgroundColors: { label: "Background Color", defaultValue: "#3AAEE0", widget: "color_picker" },
          buttonColors: { label: "Color", defaultValue: "#fff", widget: "color_picker" },
          buttonAlign: { label: "Alignment", defaultValue: "center", widget: "alignment", overrideAllowed: ["mobile"] },
                buttonFontSize: { label: "Font Size", defaultValue: "14px", widget: "font_size", overrideAllowed: ["mobile"], hidden: !0 },
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
          console.log("values Viewer", values);
          return `
                  <div class="multi_file_upload_${values._meta.htmlID}">
  
                  <div class="container">
                  <div class="card">    
                  
                   <div class="userForm">
                          <div class="textlable">First Name*</div>
                          <input type="text" required="" name="first_name"
                              placeholder="Enter first name here"> 
  
                               <div class="textlable">Last Name</div>
                          <input type="text" required="" name="last_name"
                              placeholder="Enter last name here"> 
  
                               <div class="textlable">Email*</div>
                          <input type="email" required="" name="email"
                              placeholder="Enter email here"> 
                   </div>
  
                     <div class="textlable">Upload Files</div>
                    <div class="drop_box_multi">
                      <header>
                        <h4>Select File here</h4>
                      </header>
                      <p class="textPlaceholder">Files Supported: PDF, TEXT, DOC , DOCX, JPEG, JPG, PNG</p>
                      <input type="file" hidden accept=".doc,.docx,.pdf, .jpeg,.png,.jpg" id="fileID" style="display:none;" multiple="multiple">
                      <button class="btn">Choose File</button>
                    </div>
  
                    <button class="submitButton">Submit</button>
                
                  </div>
                </div>
                      </div>
                  `;
        },
      }),
      exporters: {
        web: function (values) {
          console.log("values exporters", values);
          return `<div class="multi_file_upload_${values._meta.htmlID}" >
                  
               <div class="container">
                  <div class="card"> 
                
                   <div class="userForm">
                          <p class="textlable">First Name*</p>
                          <input type="text" required="" name="first_name"
                              placeholder="Enter first name here" > 
  
                               <p class="textlable">Last Name</p>
                          <input type="text" required="" name="last_name"
                              placeholder="Enter last name here"> 
  
                               <p class="textlable">Email*</p>
                          <input type="email" required="" name="email"
                              placeholder="Enter email here" > 
                   </div>
  
                     <p class="textlable">Upload Files</p>
                    <div class="drop_box_multi">
                      <header>
                        <h4>Select File here</h4>
                      </header>
                      <p>Files Supported: PDF, TEXT, DOC , DOCX, JPEG, JPG, PNG</p>
                      <input type="file" hidden accept=".doc,.docx,.pdf, .jpeg,.png,.jpg" id="fileID" style="display:none;" multiple="multiple">
                      <button class="btn"  onclick="handleMultiFileUploadClick(this)">Choose File</button>
                    </div>
  
                    <button class="submitButton" type="submit">Submit</button>
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
                  .multi_file_upload_${values._meta.htmlID} .container {
                     
                      width: 100%;
                      align-items: center;
                      display: flex;
                      justify-content: center;
                      background-color: transprant;
                    }
  
                       .multi_file_upload_${values._meta.htmlID} .textlable  {
                     color: ${values.textColor};
                     font-size: 12;
                     padding:0px 0px 3px;
                     margin-top:5px;
                     text-align: ${values.textAlign};
                     
                    }
  
                     .multi_file_upload_${values._meta.htmlID} .userForm input {
                     border-top-width:1px;
                     border-top-style:solid;
                     border-top-color:#CCC;
                     border-left-width:1px;
                     border-left-style:solid;
                     border-left-color:#CCC;
                     border-right-width:1px;
                     border-right-style:solid;
                     border-right-color:#CCC;
                     border-bottom-width:1px;
                     border-bottom-style:solid;
                     border-bottom-color:#CCC;
                     border-radius:0px;
                     padding:10px;
                     color:#000;
                     background-color:#FFF;
                     font-size:12px;
                     width:100%
                    }
  
                       .multi_file_upload_${values._meta.htmlID}  ::placeholder   {
                     color: ${values.placeholderColor}; 
                    }
                
                       .multi_file_upload_${values._meta.htmlID} .submitButton  {
                    border:none;
                    border-radius:${values.buttonBorderRadius};
                    display:inline-block;
                    text-align:${values.buttonAlign};
                    overflow:hidden;
                    cursor:pointer;
                    text-decoration:none;
                    padding:${values.buttonPadding};
                    margin:${values.buttonMargin};
                    font-size:${values.buttonFontSize};
                    width:100%;
                    color:${values.buttonColors};
                    background-color:${values.buttonBackgroundColors};
                    }
  
                    
                    .multi_file_upload_${values._meta.htmlID} .card {
                      border-radius: 10px;
                      box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
                      width: 600px;
                     background-color: ${values.backgroundColor};
                      padding: 10px 30px 40px;
                    }
                    
                    .multi_file_upload_${values._meta.htmlID} .card h3 {
                      font-size: 22px;
                      font-weight: 600;
                      
                    }
                    
                    .multi_file_upload_${values._meta.htmlID} .drop_box_multi {
                      margin: 10px 0;
                      padding-bottom: 20px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      flex-direction: column;
                      border: 3px dotted #a3a3a3;
                      border-radius: 5px;
                    }
                    
                    .multi_file_upload_${values._meta.htmlID} .drop_box_multi h4 {
                      font-size: 16px;
                      font-weight: 400;
                      color: ${values.textColor};
                    }
                    
                    .multi_file_upload_${values._meta.htmlID} .drop_box_multi p {
                      margin-top: 10px;
                      margin-bottom: 20px;
                      font-size: 12px;
                      color: ${values.placeholderColor};                  
                       }
                    
                    .multi_file_upload_${values._meta.htmlID} .btn {
                      text-decoration: none;
                      background-color: #005af0;
                      color: #ffffff;
                      padding: 10px 20px;
                      border: none;
                      outline: none;
                      transition: 0.3s;
                    }
                    
                    .multi_file_upload_${values._meta.htmlID} .btn:hover{
                      text-decoration: none;
                      background-color: #ffffff;
                      color: #005af0;
                      padding: 10px 20px;
                      border: none;
                      outline: 1px solid #010101;
                    }
                    .multi_file_upload_${values._meta.htmlID} .form input {
                      margin: 10px 0;
                      width: 100%;
                      background-color: #e2e2e2;
                      border: none;
                      outline: none;
                      padding: 12px 20px;
                      border-radius: 4px;
                    }
                    .multi_file_upload_${values._meta.htmlID} .check {
                      display: inline-block;
                      transform: rotate(45deg);
                      height: 24px;
                      width: 12px;
                      border-bottom: 7px solid #78b13f;
                      border-right: 7px solid #78b13f;
                    }
            
            `
        },
        js: function (values) {
          return `
                   async function handleMultiFileUploadClick(items){ 
                    }
                  `
        },
      },
    },
  });