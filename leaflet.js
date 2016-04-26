
window.onload= function() {
	var reseau_p;
	var s_reseau1;
	var s_reseau2;
	var n_layer;
	var div= L.DomUtil.create('div', 'info legend');
	
var map = L.map("map", {
        center: new L.LatLng(49.1811, -0.3712),
		zoom:16,
		fullscreenControl: true,//activer le mode plein ecran
		fullscreenControlOptions: {
        position: 'topleft'
        }
        
});

function geopUrl (key, layer, format)
{  return "http://wxs.ign.fr/"+ key + "/wmts?LAYER=" + layer
      +"&EXCEPTIONS=text/xml&FORMAT="+(format?format:"image/jpeg")
      +"&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&STYLE=normal"
      +"&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}" ;
}

var ortho=L.tileLayer ( geopUrl('7ytqc987zmmjr5g5r3gs1r7p',"ORTHOIMAGERY.ORTHOPHOTOS"), 
  {   attribution:'&copy; <a href="http://www.ign.fr/">IGN-France</a>', 
      maxZoom:18 
  } );
  
var carte=L.tileLayer ( geopUrl('7ytqc987zmmjr5g5r3gs1r7p',"GEOGRAPHICALGRIDSYSTEMS.MAPS"), 
  {   attribution:'&copy; <a href="http://www.ign.fr/">IGN-France</a>', 
      maxZoom:18 
  } );

  
      carte.addTo(map);
		var baseLayers = {
			"fond de carte": carte,
			"orthophoto": ortho,
            'sans fond': L.tileLayer(''),
		};


		var controlLayers =L.control.layers(baseLayers).addTo(map);

					  			  
			 var layer=$.getJSON("donnes/Reseau_principal.geojson",function(data){
				// add GeoJSON layer to the map once the file is loaded
				reseau_p=L.geoJson(data,{
					style : {
					"color": "#ff7800",
                    "weight": 5,
                    "opacity": 0.65
					

				},
					onEachFeature: function( feature, layer ){
					layer.bindPopup( "Matériel: "+feature.properties.MATERIAU+ "<br>Diamètre:"+ feature.properties.DIAMETRE)
			
					}
				})
			 map.fitBounds(reseau_p.getBounds());
			controlLayers.addOverlay(reseau_p, 'Réseau principal');
			
			  });
			
			  
			 $.getJSON("donnes/Sous_reseau1.geojson",function(data){
				// add GeoJSON layer to the map once the file is loaded
				s_reseau1=L.geoJson(data,{
					style : {
					"color": "blue",
                    "weight": 5,
                    "opacity": 0.65
					

				},
					onEachFeature: function( feature, layer ){
                     layer.bindPopup( "Location: "+feature.properties.location+ "<br>Matériel:"+ feature.properties.material+ "<br>Diamètre:"+ feature.properties.diameter+ "<br>Qualité:"+ feature.properties.Qualite)					
					 }
				})
			   
			   controlLayers.addOverlay(s_reseau1, 'Sous réseau1');
	       
			  });
			  $.getJSON("donnes/Sous_reseau2.geojson",function(data){
				// add GeoJSON layer to the map once the file is loaded
				 s_reseau2=L.geoJson(data,{
					style : {
					"color": "green",
                    "weight": 5,
                    "opacity": 0.65
					

				},
					onEachFeature: function( feature, layer ){
                     layer.bindPopup( "Location: "+feature.properties.location+ "<br>Matériel:"+ feature.properties.material+ "<br>Diamètre:"+ feature.properties.diameter+ "<br>Qualité:"+ feature.properties.Qualite)					
					 }
				})
			 
			 controlLayers.addOverlay(s_reseau2, 'Sous réseau2');
			 
	       
			  });
			  
			  

			  
//ajouter la legende

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    // loop through our density intervals and generate a label with a colored square for each interval
   if(n_layer==1){
        div.innerHTML += '<div id="rp"><i style="background:' + '#ff7800'+'"></i> '+'réseau principal<br></div>';
   }
		else if(n_layer==2){div.innerHTML += '<div id="sr1"><i style="background:' + 'blue'+'"></i> '+'sous réseau1<br>';}
		else div.innerHTML += '<div id="sr2"><i  style="background:' + 'green'+'"></i> '+'sous réseau2<br>';
			
		

    return div;
};

//legend.addTo(map);
	
	  
	map.on('overlayadd', function (eventLayer) {

   if (eventLayer.name === 'Réseau principal') {
 
	   n_layer=1;
       legend.addTo(this);	  	   
	   }
  else if (eventLayer.name === 'Sous réseau1') { 
	   n_layer=2;
       legend.addTo(this);	
  }
   else { 
	   n_layer=3;
       legend.addTo(this);	
  }
  });  
  map.on('overlayremove', function (eventLayer) {

   if (eventLayer.name === 'Réseau principal') {
var rp = document.getElementById("rp"); 
div.removeChild(rp); 
    
	   }
	     else if (eventLayer.name === 'Sous réseau1') { 
 var sr1 = document.getElementById("sr1"); 
div.removeChild(sr1); 
 
  }
   else { 
var sr2 = document.getElementById("sr2"); 
div.removeChild(sr2);  

  }

  }); 
	  
	  
	  

}






























