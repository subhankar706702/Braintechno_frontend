unlayer.registerTool({
    name: 'rating_half',
    label: 'Star Rating',
    icon: 'https://braintechnodesignfiles.s3.ap-south-1.amazonaws.com/130/designdocument/f7ba60eb-c206-4461-9fab-51a8bd3ed10b.png',
    supportedDisplayModes: ['web', 'email'],
    options: {
        default: {
            title: null,
        },

        // colors: {
        //     title: "Colors",
        //     position: 1,
        //     options: {
        //         "textColor": {
        //             "label": "Text Color",
        //             "defaultValue": "#FF0000",
        //             "widget": "color_picker"
        //         },
        //         "backgroundColor": {
        //             "label": "Background Color",
        //             "defaultValue": "#FF0000",
        //             "widget": "color_picker"
        //         }
        //     }
        // },


        // occupation: {
        //     title: 'Occupation',
        //     position: 1,
        //     options: {
        //         occupation: {
        //             label: 'Occupation',
        //             defaultValue: 'Software Engineer',
        //             widget: 'dropdown',
        //         },
        //     },
        // },
        text: {
            title: 'RATING',
            position: 1,
            options: {
                textColor: {
                    label: 'Color',
                    defaultValue: '#ccc',//'#ff0000',#aaa
                    widget: 'color_picker', // built_in property editor
                },
                checkedColor: {
                    label: 'Checked Color',
                    defaultValue: '#ffc700',//'#ff0000',#f2b600
                    widget: 'color_picker', // built_in property editor
                },
                textAlign: {
                    label: 'Align',
                    defaultValue: 'left',
                    widget: 'alignment'
                },
              height: {
                label: 'Height',
                defaultValue: '48',
                widget: 'counter'
              },
              width: {
                label: 'Width',
                defaultValue: '24',
                widget: 'counter'
              }
            },
        },
    },
    values: {},
    renderer: {
        Viewer: unlayer.createViewer({
            render(values) {
                console.log("values Viewer", values);
                return `<div class="rate_${values._meta.htmlID}" style="position: relative; text-align: ${values.textAlign}">

                <div class="ratingControl">
  <input id="score100_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="100" />
  <label for="score100_${values._meta.htmlID}" class="ratingControl__star" title="Five Stars"></label>
  <input id="score90_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="90" />
  <label for="score90_${values._meta.htmlID}" class="ratingControl__star" title="Four & Half Stars"></label>
  <input id="score80_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="80" />
  <label for="score80_${values._meta.htmlID}" class="ratingControl__star" title="Four Stars"></label>
  <input id="score70_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="70" />
  <label for="score70_${values._meta.htmlID}" class="ratingControl__star" title="Three & Half Stars"></label>
  <input id="score60_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="60" />
  <label for="score60_${values._meta.htmlID}" class="ratingControl__star" title="Three Stars"></label>
  <input id="score50_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="50" />
  <label for="score50_${values._meta.htmlID}" class="ratingControl__star" title="Two & Half Stars"></label>
  <input id="score40_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="40" />
  <label for="score40_${values._meta.htmlID}" class="ratingControl__star" title="Two Stars"></label>
  <input id="score30_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="30" />
  <label for="score30_${values._meta.htmlID}" class="ratingControl__star" title="One & Half Star"></label>
  <input id="score20_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="20" />
  <label for="score20_${values._meta.htmlID}" class="ratingControl__star" title="One Star"></label>
  <input id="score10_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="10" />
  <label for="score10_${values._meta.htmlID}" class="ratingControl__star" title="Half Star"></label>
</div>

                    </div>`;
            },
        }),
        exporters: {
            web: function (values) {
                console.log("values exporters", values);
                return `<div class="rate_${values._meta.htmlID}" style="position: relative; text-align: ${values.textAlign}">
                
                <div class="ratingControl">
  <input id="score100_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="100" />
  <label for="score100_${values._meta.htmlID}" class="ratingControl__star" title="Five Stars"></label>
  <input id="score90_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="90" />
  <label for="score90_${values._meta.htmlID}" class="ratingControl__star" title="Four & Half Stars"></label>
  <input id="score80_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="80" />
  <label for="score80_${values._meta.htmlID}" class="ratingControl__star" title="Four Stars"></label>
  <input id="score70_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="70" />
  <label for="score70_${values._meta.htmlID}" class="ratingControl__star" title="Three & Half Stars"></label>
  <input id="score60_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="60" />
  <label for="score60_${values._meta.htmlID}" class="ratingControl__star" title="Three Stars"></label>
  <input id="score50_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="50" />
  <label for="score50_${values._meta.htmlID}" class="ratingControl__star" title="Two & Half Stars"></label>
  <input id="score40_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="40" />
  <label for="score40_${values._meta.htmlID}" class="ratingControl__star" title="Two Stars"></label>
  <input id="score30_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="30" />
  <label for="score30_${values._meta.htmlID}" class="ratingControl__star" title="One & Half Star"></label>
  <input id="score20_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="20" />
  <label for="score20_${values._meta.htmlID}" class="ratingControl__star" title="One Star"></label>
  <input id="score10_${values._meta.htmlID}" class="ratingControl__radio" type="radio" name="rating_${values._meta.htmlID}" value="10" />
  <label for="score10_${values._meta.htmlID}" class="ratingControl__star" title="Half Star"></label>
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
                .rate_${values._meta.htmlID} .ratingControl {
                    position: relative;
                    display: inline-flex;
                    direction: rtl;
                  }
                  .rate_${values._meta.htmlID} .ratingControl__radio {
                    position: absolute;
                    height: 0;
                    width: 0;
                    opacity: 0;
                  }
                  .rate_${values._meta.htmlID} .ratingControl__star {
                    position: relative;
                    display: block;
                    height: ${values.height}px;
                    width: ${values.width}px;
                    cursor: pointer;
                    overflow: hidden;
                  }
                  .rate_${values._meta.htmlID} .ratingControl__star:nth-last-of-type(odd)::before, .ratingControl__star:nth-last-of-type(odd)::after {
                    left: 0;
                    -webkit-clip-path: polygon(50% 0%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
                            clip-path: polygon(50% 0%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
                  }
                  .rate_${values._meta.htmlID} .ratingControl__star:nth-last-of-type(even)::before, .ratingControl__star:nth-last-of-type(even)::after {
                    right: 0;
                    -webkit-clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%);
                            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%);
                  }
                  .rate_${values._meta.htmlID} .ratingControl__star::before, .ratingControl__star::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    height: 100%;
                  }
                  .rate_${values._meta.htmlID} .ratingControl__star::before {
                    width: 200%;
                    background-color: ${values.textColor};
                  }
                  .rate_${values._meta.htmlID} .ratingControl__star::after {
                    background-color: ${values.checkedColor};
                  }
                  .rate_${values._meta.htmlID} .ratingControl__star:hover::after, .ratingControl__star:hover ~ .ratingControl__star::after, .ratingControl__radio:checked ~ .ratingControl__star::after {
                    width: 200%;
                  }
          `
            },
            js: function (values) {
                return `
                `
            },
        },
    },
});