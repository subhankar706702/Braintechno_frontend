unlayer.registerTool({
  name: 'form_input',
  label: 'New Form',
  icon: 'https://braintechnodesignfiles.s3.ap-south-1.amazonaws.com/130/designdocument/ba0b27a6-c6df-41c1-9ded-7299e92d9083.jpg',
  supportedDisplayModes: ['web', 'email'],
  options: {
    default: {
      title: null,
    },
    formField: {
      title: "Form Field",
      position: 1,
      options: {
        phoneValue: {
          label: "Phone No.",
          defaultValue: true,
          widget: "toggle",
        },
        locationValue: {
          label: "Location.",
          defaultValue: true,
          widget: "toggle"
        },
      }
    },

    text: {
      title: 'LABELS',
      position: 2,
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
      position: 3,
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
        return `<div class="form_input_${values._meta.htmlID}">
  
                  <div class="container">
                  <div class="card">
                   <div class="userForm">
                            <div class="textlable">First Name*</div>
                            <input type="text" required="" id="firstName" 
                                placeholder="Enter first name here" > 

                                <div class="textlable">Last Name*</div>
                            <input type="text" required="" id="lastName" 
                                placeholder="Enter last name here" >

                            <div class="phoneDiv">
                                 <div class="textlable" >Phone Number</div>
                            <input type="text"  name="phone_no" id="phone_no" 
                                placeholder="Enter phone no. here"> 
                                </div>

                                 <div class="textlable">Email*</div>
                            <input type="email"  name="email" id="email" 
                                placeholder="Enter email here"> 

                             <div class="locationDiv">
                                 <div class="textlable">Location</div>
                            <input type="text"  name="location" id="location" 
                                placeholder="Enter location here">
                                 </div>
                     </div>

                 <button class="submitButton" onclick="">Submit</button>
                  </div>
                </div>
  
                      </div>`;
      },
    }),
    exporters: {
      web: function (values) {
        return `<div class="form_input_${values._meta.htmlID}" >
                  
                  <div class="container">
                  <div class="card">
                   <div class="userForm">
                            <div class="textlable">First Name*</div>
                            <input type="text" required="" id="firstName" 
                                placeholder="Enter name here" > 

                                <div class="textlable">Last Name*</div>
                            <input type="text" required="" id="lastName" 
                                placeholder="Enter name here" >
    
                                <div class="phoneDiv">
                                 <div class="textlable" >Phone Number</div>
                            <input type="text"  name="phone_no" id="phone_no" 
                                placeholder="Enter phone no. here"> 
                                </div> 
    
                                 <div class="textlable">Email*</div>
                            <input type="email"  name="email" id="email" 
                                placeholder="Enter email here"> 

                                  <div class="locationDiv">
                                 <div class="textlable">Location</div>
                            <input type="text"  name="location" id="location" 
                                placeholder="Enter location here">
                                 </div>
                     </div>

                 <button class="submitButton" onclick="uploadForm()">Submit</button>
                  </div>
                </div>
                           </div>`;
      },
      email: function (values) {
        return `
          <style>
          .form_input_${values._meta.htmlID} .container {
                     
                      width: 100%;
                      align-items: center;
                      display: flex;
                      justify-content: center;
                      background-color: transprant;
                    }
                    
                    .form_input_${values._meta.htmlID} .card {
                      width:100%;
                      border-radius: 10px;
                      box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
                      background-color: #ffffff;
                      padding: 10px 30px 40px;
                    }
                    
                    .form_input_${values._meta.htmlID} .card h3 {
                      font-size: 22px;
                      font-weight: 600;
                      
                    }
                    
                    
                    
                    .form_input_${values._meta.htmlID} .btn {
                      text-decoration: none;
                      background-color: #005af0;
                      color: #ffffff;
                      padding: 10px 20px;
                      border: none;
                      outline: none;
                      transition: 0.3s;
                    }
                    
                    .form_input_${values._meta.htmlID} .btn:hover{
                      text-decoration: none;
                      background-color: #ffffff;
                      color: #005af0;
                      padding: 10px 20px;
                      border: none;
                      outline: 1px solid #010101;
                    }
                    .form_input_${values._meta.htmlID} .form input {
                      margin: 10px 0;
                      width: 100%;
                      background-color: #e2e2e2;
                      border: none;
                      outline: none;
                      padding: 12px 20px;
                      border-radius: 4px;
                    }
                    .form_input_${values._meta.htmlID} .check {
                      display: inline-block;
                      transform: rotate(45deg);
                      height: 24px;
                      width: 12px;
                      border-bottom: 7px solid #78b13f;
                      border-right: 7px solid #78b13f;
                    }
  
                     .form_input_${values._meta.htmlID} .userForm input {
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
  
                         .form_input_${values._meta.htmlID}  ::placeholder   {
                       color: ${values.placeholderColor}; 
                      }
                          .form_input_${values._meta.htmlID} .submitButton  {
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
  
                           .form_input_${values._meta.htmlID} .textlable  {
                       color: ${values.textColor};
                       font-size: 12;
                       padding:0px 0px 3px;
                       margin-top:5px;
                       text-align: ${values.textAlign};
                       
                      }

                      
  
                     .form_input_${values._meta.htmlID} .card {
                        border-radius: 10px;
                        box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
                        
                       background-color: ${values.backgroundColor};
                        padding: 10px 30px 40px;
                      }
                      
                      .form_input_${values._meta.htmlID} .card h3 {
                        font-size: 22px;
                        font-weight: 600;
                        
                      }

                      ${values.phoneValue ? '.phoneDiv { display: block; }' : '.phoneDiv { display: none; }'}

                       ${values.locationValue ? '.locationDiv { display: block; }' : '.locationDiv { display: none; }'}
          </style>

          <div class="form_input_${values._meta.htmlID}">
  
                  <div class="container">
                  <div class="card">
                   <div class="userForm">
                            <div class="textlable">First Name*</div>
                            <input type="text" required="" id="firstName" 
                                placeholder="Enter first name here" > 

                                 <div class="textlable">Last Name*</div>
                            <input type="text" required="" id="lastName" 
                                placeholder="Enter last name here" >

                                 <div class="phoneDiv">
                                 <div class="textlable" >Phone Number</div>
                            <input type="text"  name="phone_no" id="phone_no" 
                                placeholder="Enter phone no. here"> 
                                </div>
    
                                 <div class="textlable">Email*</div>
                            <input type="email"  name="email" id="email" 
                                placeholder="Enter email here"> 

                                  <div class="locationDiv">
                                 <div class="textlable">Location</div>
                            <input type="text"  name="location" id="location" 
                                placeholder="Enter location here">
                                 </div>
                     </div>

                 <button class="submitButton" onclick="uploadForm()">Submit</button>
                  </div>
                </div>
                      </div>
          `;
      },
    },
    head: {
      css: function (values) {
        return `   
                  .form_input_${values._meta.htmlID} .container {
                     
                      width: 100%;
                      align-items: center;
                      display: flex;
                      justify-content: center;
                      background-color: transprant;
                    }
                    
                    .form_input_${values._meta.htmlID} .card {
                      width:100%;
                      border-radius: 10px;
                      box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
                      background-color: #ffffff;
                      padding: 10px 30px 40px;
                    }
                    
                    .form_input_${values._meta.htmlID} .card h3 {
                      font-size: 22px;
                      font-weight: 600;
                      
                    }
                    
                    
                    
                    .form_input_${values._meta.htmlID} .btn {
                      text-decoration: none;
                      background-color: #005af0;
                      color: #ffffff;
                      padding: 10px 20px;
                      border: none;
                      outline: none;
                      transition: 0.3s;
                    }
                    
                    .form_input_${values._meta.htmlID} .btn:hover{
                      text-decoration: none;
                      background-color: #ffffff;
                      color: #005af0;
                      padding: 10px 20px;
                      border: none;
                      outline: 1px solid #010101;
                    }
                    .form_input_${values._meta.htmlID} .form input {
                      margin: 10px 0;
                      width: 100%;
                      background-color: #e2e2e2;
                      border: none;
                      outline: none;
                      padding: 12px 20px;
                      border-radius: 4px;
                    }
                    .form_input_${values._meta.htmlID} .check {
                      display: inline-block;
                      transform: rotate(45deg);
                      height: 24px;
                      width: 12px;
                      border-bottom: 7px solid #78b13f;
                      border-right: 7px solid #78b13f;
                    }
  
                     .form_input_${values._meta.htmlID} .userForm input {
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
  
                         .form_input_${values._meta.htmlID}  ::placeholder   {
                       color: ${values.placeholderColor}; 
                      }
                          .form_input_${values._meta.htmlID} .submitButton  {
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
  
                           .form_input_${values._meta.htmlID} .textlable  {
                       color: ${values.textColor};
                       font-size: 12;
                       padding:0px 0px 3px;
                       margin-top:5px;
                       text-align: ${values.textAlign};
                       
                      }
  
                     .form_input_${values._meta.htmlID} .card {
                        border-radius: 10px;
                        box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
                        
                       background-color: ${values.backgroundColor};
                        padding: 10px 30px 40px;
                      }
                      
                      .form_input_${values._meta.htmlID} .card h3 {
                        font-size: 22px;
                        font-weight: 600;
                        
                      }
                      ${values.phoneValue ? '.phoneDiv { display: block; }' : '.phoneDiv { display: none; }'}
                      ${values.locationValue ? '.locationDiv { display: block; }' : '.locationDiv { display: none; }'}

                     
            `
      },
      js: function (values) {
        return `
  
                  async function uploadForm(items){    
                    }
                  `
      },
    },
  },
});