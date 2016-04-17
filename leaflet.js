
window.onload= function() {
	var reseau;
var map = L.map("map", {
        center: new L.LatLng(49.1811, -0.3712),
        zoom: 15
});

var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                var osmAttrib='Map data de OpenStreetMap';
                var osm = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 45, attribution: osmAttrib});           
                // on centre sur la France
              // map.addLayer(osm);


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
			"osm":osm,
            'sans fond': L.tileLayer(''),
		};



		L.control.layers(baseLayers).addTo(map);
	

		var reseau;
     $.getJSON("donnes/Reseau-principal1.geojson",function(data){
				// add GeoJSON layer to the map once the file is loaded
				 var reseau=L.geoJson(data,{
					style : {
					stroke : false,
					fillColor: 'red',
					fillOpacity : 1,
					
				},
					onEachFeature: function( feature, layer ){
						layer.bindPopup( "test: "+feature.properties.lib_treg+ "<br>id :"+ feature.properties.objectid)
					}
									
				}).addTo(map);
		
       map.fitBounds(reseau.getBounds());
			
			  });
			  
			  
			  
			  
			  $.getJSON("test_conversion.geojson",function(data){
				// add GeoJSON layer to the map once the file is loaded
				var test=L.geoJson(data,{
					style : {
					stroke : false,
					fillColor: 'red',
					fillOpacity : 1,
					

				},
					onEachFeature: function( feature, layer ){
						layer.bindPopup( "test: "+feature.properties.lib_treg+ "<br>id :"+ feature.properties.objectid)
					}
				})
				test.addTo(map);
	         // map.fitBounds(test.getBounds());
			  });
			
}








