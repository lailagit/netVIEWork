
window.onload= function() {
	var reseau_p;
	var s_reseau1;
	var s_reseau2;
var map = L.map("map", {
        center: new L.LatLng(49.1811, -0.3712),
        zoom: 15
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
              
}








