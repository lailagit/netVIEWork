/*
Nom de l'application: netVIEWork
Description: affichage dynamique des réseaux enterés
Autheurs: KAICHOUH-ZAROUGUI-PETIT
*/
//déclaration des variables globales
var layer;
var reseau_p;
var s_reseau=[];
var ancien_layer;
var coche_d = 1;
var coche_q = 1;
var val_diam = [];
var premiere=true;
//déclaration de la légende
var div = L.DomUtil.create('div', 'info legend'); 
var legend;
window.onload = function() { //au chargement de la page

//ne pas afficher la légende du diamètre et de qualité au chargement de la page
document.getElementById('leg_diam').style.display="none";
document.getElementById('leg_qual').style.display="none";
document.getElementById('option_q1').style.display="none";	
document.getElementById('option_q2').style.display="none";	
document.getElementById('text_q').style.fontWeight="bold";
document.getElementById('text_d').style.fontWeight="bold";	 
//définir la légende de qualité
document.getElementById('leg_qual').innerHTML += '<div>' + '<br><span id="titre">Niveau de qualité</span><br></div>'; 
document.getElementById('leg_qual').innerHTML += '<div><i style="background:' + 'black' + '"></i> ' + 'Bonne<br></div>';
document.getElementById('leg_qual').innerHTML += '<div><i id="dash"></i> ' + 'Avec défaut<br></div>';
//définir la légende de qualité
document.getElementById('leg_diam').innerHTML += '<div id="diam_l1">' + '<br><span id="titre">Diamètre</span><br></div>'; 
    var n_layer;
    

    var map = L.map("map", { //délclaration de la carte 
        center: new L.LatLng(49.1811, -0.3712),
        zoom: 16, //niveau de zoom initial
        fullscreenControl: true, //activer le mode plein ecran
        fullscreenControlOptions: {
            position: 'topleft'
        }

    });

    //fonction de chargement des données du géoportail
    //key:la clé développement du géoportail
    //format:le format du résultat fourni
    //layer: la couche du géoportail à charger
    function geopUrl(key, layer, format) {
        return "http://wxs.ign.fr/" + key + "/wmts?LAYER=" + layer +
            "&EXCEPTIONS=text/xml&FORMAT=" + (format ? format : "image/jpeg") +
            "&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&STYLE=normal" +
            "&TILEMATRIXSET=PM&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}";
    }
    //chargement de l'orthophoto du géoportail
    var ortho = L.tileLayer(geopUrl('7ytqc987zmmjr5g5r3gs1r7p', "ORTHOIMAGERY.ORTHOPHOTOS"), {
        attribution: '&copy; <a href="http://www.ign.fr/">IGN-France</a>',
        maxZoom: 18
    });
    //chargement de la carte de base du géoportail  
    var carte = L.tileLayer(geopUrl('7ytqc987zmmjr5g5r3gs1r7p', "GEOGRAPHICALGRIDSYSTEMS.MAPS"), {
        attribution: '&copy; <a href="http://www.ign.fr/">IGN-France</a>',
        maxZoom: 18
    });

    
    carte.addTo(map);//la carte de base comme vue initiale
    //définir les couches de bases
    var baseLayers = {
        "fond de carte": carte,
        "orthophoto": ortho,
        'sans fond': L.tileLayer(''),
    };

    //ajout des couches de base à la carte
	
    var controlLayers = L.control.layers(baseLayers).addTo(map);
     
//ajouter la legende

    legend = L.control({
        position: 'bottomright'
    });
	legend.onAdd = function(map) {
		div.innerHTML += '<div>' + '<span id="titre_l">Légende</span><br></div>'; 
		
        if (n_layer == 1) {
			reseau_p.bringToBack();
            div.innerHTML += '<div id="rp"><i style="background:' + '#FFA500' + '"></i> ' + 'réseau principal<br></div>';
        } else if (n_layer == 2) {
            div.innerHTML += '<div id="sr1"><i style="background:' + 'blue' + '"></i> ' + 'sous réseau1<br></div>';
        } else if(n_layer == 3) div.innerHTML += '<div id="sr2"><i  style="background:' + 'green' + '"></i> ' + 'sous réseau2<br></div>';

        return div;
    };
	div.style.display = "block";
	legend.addTo(map);
	//	Récupérer tous les réseaux(fichiers.geojson) du chemain indiqué
	var xhr = new XMLHttpRequest();

xhr.open("GET","fichiers.php", true);

xhr.send();
xhr.addEventListener('readystatechange',  function(e) {
		if(xhr.readyState == 4 && xhr.status == 200) 
		{
	   b= JSON.parse(xhr.responseText);

	
	for (var j = 0; j < b.length; j++) {

	(function(j){
		var result = b[j].indexOf('Reseau_principal');
		if (result == -1) {
		var chemin = "donnes/" + b[j] + ".geojson";
		//Récupérer le réseau et définir son style
	   layer = $.getJSON(chemin, function(data) {
		  reseau = L.geoJson(data, {
			 style: {
				"color": "blue",
				"weight": 3,
				"opacity": 1
			 },


			 onEachFeature: function(feature, layer) {
				 //afficher les poup au survol des tronçons du réseau
					layer.bindPopup("Location: "+feature.properties.location+ "<br>Matériel:"+ feature.properties.material+ "<br>Diamètre:"+ feature.properties.diameter+ "<br>Qualité:"+ feature.properties.Qualite)
				 	layer.on('mouseover', function() { 
			    ancien_layer=layer;
				layer.openPopup(); 
				layer.setStyle({
				color: '#666',
				
            });		
				});
                layer.on('mouseout', function() { layer.closePopup();
					layer.setStyle({
				color: ancien_layer.options.style.color,
            });
				
	           				});
				 
				 
				 
				 }


			  })

			  controlLayers.addOverlay(reseau, b[j]);
			  s_reseau.push(reseau);
		});
	}else{
		//chargement du réseau principal
		layer=$.getJSON("donnes/Reseau_principal.geojson",function(data){
				// add GeoJSON layer to the map once the file is loaded
				reseau_p=L.geoJson(data,{
					style : {
					"color": '#FFA500',
                    "weight": 3,
                    "opacity": 1
					

				},
					onEachFeature: function( feature, layer ){
					layer.bindPopup( "Matériel: "+feature.properties.MATERIAU+ "<br>Diamètre:"+ feature.properties.DIAMETRE)
						layer.on('mouseover', function() { 
			    ancien_layer=layer;
				layer.openPopup(); 
				layer.setStyle({
				color: '#666',
				
            });		
				});
                layer.on('mouseout', function() { layer.closePopup();
					layer.setStyle({
				color: ancien_layer.options.style.color,
            });
				
	           				});
			
					}
				})
			//zommer la carte sur le réseau principal
			 map.fitBounds(reseau_p.getBounds());
			controlLayers.addOverlay(reseau_p, 'Réseau principal');
			
			  });
		
	}
		})(j);

}
}
});		  			  

    legend.onAdd = function(map) {
		
        if (n_layer == 1) {
			reseau_p.bringToBack();
            div.innerHTML += '<div id="rp"><i style="background:' + '#FFA500' + '"></i> ' + 'réseau principal<br></div>';
        } else if (n_layer == 2) {
            div.innerHTML += '<div id="sr1"><i style="background:' + 'blue' + '"></i> ' + 'sous réseau1<br></div>';
        } else if(n_layer == 3) div.innerHTML += '<div id="sr2"><i  style="background:' + 'green' + '"></i> ' + 'sous réseau2<br></div>';

        return div;
    };

    

    map.on('overlayadd', function(eventLayer) {
		

        if (eventLayer.name === 'Réseau principal') {

            n_layer = 1;
            legend.addTo(this);
        } else if (eventLayer.name === 'Sous réseau1') {
            n_layer = 2;
            legend.addTo(this);
        } else {
            n_layer = 3;
            legend.addTo(this);
        }
    });
    map.on('overlayremove', function(eventLayer) {
		

        if (eventLayer.name === 'Réseau principal') {
            var rp = document.getElementById("rp");
            div.removeChild(rp);

        } else if (eventLayer.name === 'Sous réseau1') {
            var sr1 = document.getElementById("sr1");
            div.removeChild(sr1);

        } else {
            var sr2 = document.getElementById("sr2");
            div.removeChild(sr2);

        }
        if(div.childNodes[0]==null) {//désactiver la légende en cas de non activation des réseaux
			div.style.display = "none";
		}
    });


}
//fonction d'activation des couches
	
	function activer(ev,couche) {

		
	}
//fonction qui récupère les diamètres de tous les réseaux 
function getdiametre(d) {
	if(!contains.call(val_diam,d)&d!=null&d!=0)
	{
		//récupérer tous les diamètres dans un tableau val_diam
		val_diam.push(d);
	}
        return d/100;

}
//fonction qui retourne le style de trait selon la qualité du tronçon
function getdash(q) {
    if (q=="Bonne") return '';
	
    else return '3';

}

//affichage dynamique selon le diamètre 
function affichage_dynamique_diam(ev) {
	

    if (coche_d == 1) {//lors de l'activation du checkbox diamètre
		if(document.getElementById('qual').checked ) {
		document.getElementById('text_d').style.color="black";
		document.getElementById('text_q').style.color="black";
		}
       else  document.getElementById('text_q').style.color="#808080";		
		document.getElementById('leg_diam').style.display="block";
       	 		
        reseau_p.eachLayer(function(reseau_p) {
            diametreValue = reseau_p.feature.properties.DIAMETRE;

            var diametre = getdiametre(diametreValue);


            reseau_p.setStyle({

                weight: diametre

            });
        });
		for(var i= 0; i < s_reseau.length; i++)
		{
			var ss_reseau=s_reseau[i];
        s_reseau[i].eachLayer(function(ss_reseau) {
            diametreValue = ss_reseau.feature.properties.DIAMETRE;

            var diametre = getdiametre(diametreValue);


            ss_reseau.setStyle({

                weight: diametre

            });
        });
		}

		coche_d = 0;
		if(premiere){
		//trier le tableau des diamètres
		val_diam.sort(compare);
		
		for(var i= 0; i < val_diam.length; i++)
	{
		//afficher les diamètres dans la légende
		 document.getElementById('leg_diam').innerHTML += '<div><i style="background:' + 'black;height:'+val_diam[i]/100+'px'+'"></i> ' + 'Diamètre:'+val_diam[i]+'m<br></div>';
	}
		}
		premiere=false;
    } else {
        reseau_p.setStyle({

            weight: 2

        });
		for(var i= 0; i < s_reseau.length; i++){
        s_reseau[i].setStyle({

            weight: 2

        });
		}

		coche_d = 1;
	 //enlever la legnende 
	 document.getElementById('leg_diam').style.display="none";
	 if(document.getElementById('qual').checked ) document.getElementById('text_d').style.color="#808080";
	 else document.getElementById('text_q').style.color="black";	

    }
    

}

//vérifier si un tableu contient un élément
var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};
//fonction utilisé pour le tri 
	function compare(x, y) {
    return x - y;
}
//affichage dynamique selon la qualité
function affichage_dynamique_qual(ev) {	
	 if (coche_q == 1) {
		 if(document.getElementById('diam').checked ) {document.getElementById('text_q').style.color="black";	
		 document.getElementById('text_d').style.color="black";	
		 }
		 else document.getElementById('text_d').style.color="#808080";
		 document.getElementById('leg_qual').style.display="block";
		 document.getElementById('option_q1').style.display="block";	
         document.getElementById('option_q2').style.display="block";			 
		 for(var i= 0; i < s_reseau.length; i++){
			 var ss_reseau=s_reseau[i];

        ss_reseau.eachLayer(function(ss_reseau) {
            qualiteValue = ss_reseau.feature.properties.Qualite;

            var dash = getdash(qualiteValue);


            ss_reseau.setStyle({

                dashArray: dash

            });
        });
		 }

		 coche_q = 0;
    } else {
		for(var i= 0; i < s_reseau.length; i++){
       
        s_reseau[i].setStyle({

            dashArray: ''

        });
		}

        coche_q = 1;
   
	 document.getElementById('leg_qual').style.display="none";
	 document.getElementById('option_q1').style.display="none";	
     document.getElementById('option_q2').style.display="none";	
	 if(document.getElementById('diam').checked ) document.getElementById('text_q').style.color="#808080";
	 else document.getElementById('text_d').style.color="black";	
}
}























