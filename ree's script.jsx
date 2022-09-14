{
   function myScript(thisObj){
      function myScript_buildUI(thisObj){
         var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Dockable Script", undefined, {resizeable:true, closeButton: false});

         res = "group{orientation:'column',\
                        groupOne: Panel{orientation:'column',\
                        layerSizeText: StaticText{text:'Layer Size Resizing'},\
                        numChangingText: StaticText{text:'100%'},\
                        controlSlider: Slider{},\
                        returnSize: Button{text:'Resize'},\
               },\
               groupTwo: Panel{orientation:'column',\
                        advancedTwixtorText: StaticText{text:'Advanced Twixtor'},\
                        applyButton: Button{text:'Apply'},\
               },\
         }";

         myPanel.grp = myPanel.add(res);

         //interface options
         myPanel.grp.groupTwo.advancedTwixtorText.size = [100, 25];
         myPanel.grp.groupTwo.advancedTwixtorText.justify = "center";
         //
         myPanel.grp.groupOne.numChangingText.characters = 4;
         myPanel.grp.groupOne.numChangingText.justify = "center";
         myPanel.grp.groupOne.numChangingText.active = true;
         //
         myPanel.grp.groupOne.controlSlider.minvalue = 0;
         myPanel.grp.groupOne.controlSlider.maxvalue = 100;
         myPanel.grp.groupOne.controlSlider.value = 100;
         // initialslider, slidervalue, ni, nf section
         //
         //var tmp = 100;
         // onchanging revealing of the text
         myPanel.grp.groupOne.controlSlider.onChanging = function () {
            myPanel.grp.groupOne.numChangingText.text = myPanel.grp.groupOne.controlSlider.value.toFixed() + "%";
         }
         //main resizing
         myPanel.grp.groupOne.controlSlider.onChange = function() {
            //alert("initial tmp = " + tmp);
            app.beginUndoGroup("resizing");
            //alert("second parameter = " + myPanel.grp.groupOne.controlSlider.value.toFixed());
            resizing(myPanel.grp.groupOne.controlSlider.value.toFixed());
            tmp = myPanel.grp.groupOne.controlSlider.value.toFixed();
            //alert("updated tmp = " + tmp);
            app.endUndoGroup();
         }
         //onclick functions
         myPanel.grp.groupOne.returnSize.onClick = function() {
            myPanel.grp.groupOne.controlSlider.value = 100;
            myPanel.grp.groupOne.numChangingText.text = "100%";
            //tmp = 100;
         }
   
        myPanel.grp.groupTwo.applyButton.onClick = function() {
             keynudging();
            }
    
         
         myPanel.layout.layout(true);

         return myPanel;
      }
   
   
      var myScriptPal = myScript_buildUI(thisObj);

      if (myScriptPal != null && myScriptPal instanceof Window){
         myScriptPal.center();
         myScriptPal.show();
      }

   }
   myScript(this);
}
// main algorithms
function resizing (slider_value){
   //app.beginUndoGroup("resizing");

      var layers = app.project.activeItem.selectedLayers;
      for(var i=0; i < layers.length; i++){
         if (layers[i].source != null && layers[i].source.mainSource instanceof SolidSource){
            var niWidth = layers[i].source.width;
            var niHeight = layers[i].source.height;
            layers[i].source.width = niWidth * slider_value/100;
            layers[i].source.height = niHeight * slider_value/100;
         }
      }
      //layers = [];
      myPanel.grp.groupOne.controlSlider.value = 100;
      myPanel.grp.groupOne.numChangingText.text = "100%";

      //app.endUndoGroup("resizing");
}

function keynudging(){
   var comp = app.project.activeItem;
   var layer = comp.selectedLayers;
   var fr = comp.frameRate;

   app.beginUndoGroup("keynudging");
   if(layer.length != 1){
      alert("Choose only one time-remap enabled layer");
   }
   else {
      var keys = layer[0].property("Time Remap").selectedKeys;
      if(keys.length <= 1){
         alert("Please select at least 2 time-remapped keyframes")
      }
      else {
         mfunc(0);
      }
   }

   // main code is here
 
   function mfunc(activeLayer){
      var values = [];
     
      for (var k = keys[0]; k < keys[0] + keys.length; k ++){
         values.push(layer[activeLayer].property("Time Remap").keyValue(k));
      }
      
      for (var i = 0; i < keys.length - 1; i++){
         layer[activeLayer].property("Time Remap").removeKey(keys[0] + 1);
      }
      for (var i = 1; i < keys.length; i++){
            var temp = layer[activeLayer].inPoint;
            
         layer[activeLayer].property("Time Remap").setValueAtTime((values[0]*fr + i)/fr + temp, values[i]);
      }
   }
   app.endUndoGroup();
}