/*
Nom de l'application: netVIEWork
Description: affichage dynamique des réseaux enterés
Autheurs: KAICHOUH-ZAROUGUI-PETIT
*/
//déclaration des variables globales
var layer;
var reseau_p;
var s_reseau1;
var s_reseau2;
var coche_d = 1;
var coche_q = 1;
//déclaration de la légende
var div = L.DomUtil.create('div', 'info legend'); 
var legend;
window.onload = function() { //au chargement de la page

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
    var baseLayers = {
        "fond de carte": carte,
        "orthophoto": ortho,
        'sans fond': L.tileLayer(''),
    };

    //définir les couches de bases
    var controlLayers = L.control.layers(baseLayers).addTo(map);


    layer = $.getJSON("donnes/Reseau_principal.geojson", function(data) {
        // add GeoJSON layer to the map once the file is loaded
        reseau_p = L.geoJson(data, {
            style: {
                "color": "black",
                "weight": 2,
                "opacity": 1


            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup("Matériel: " + feature.properties.MATERIAU + "<br>Diamètre:" + feature.properties.DIAMETRE)

            }
        })
        map.fitBounds(reseau_p.getBounds());
        controlLayers.addOverlay(reseau_p, 'Réseau principal');

    });


    $.getJSON("donnes/Sous_reseau1.geojson", function(data) {
        // add GeoJSON layer to the map once the file is loaded
        s_reseau1 = L.geoJson(data, {
            style: {
                "color": "blue",
                "weight": 2,
                "opacity": 1


            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(feature.properties.location + "<br>Matériel:" + feature.properties.material + "<br>Diamètre:" + feature.properties.diameter + "<br>Qualité:" + feature.properties.Qualite)
            }
        })

        controlLayers.addOverlay(s_reseau1, 'Sous réseau1');

    });
    $.getJSON("donnes/Sous_reseau2.geojson", function(data) {
        // add GeoJSON layer to the map once the file is loaded
        s_reseau2 = L.geoJson(data, {
            style: {
                weight: 2,
				opacity: 1,
				color: 'green',
				
				
				
			


            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup( feature.properties.location + "<br>Matériel:" + feature.properties.material + "<br>Diamètre:" + feature.properties.diameter + "<br>Qualité:" + feature.properties.Qualite)
            }
        })

        controlLayers.addOverlay(s_reseau2, 'Sous réseau2');


    });




    //ajouter la legende

    legend = L.control({
        position: 'bottomright'
    });
	div.innerHTML += '<div>' + '<span id="titre_l">Légende</span><br></div>'; 

    legend.onAdd = function(map) {
		
        if (n_layer == 1) {
            div.innerHTML += '<div id="rp"><i style="background:' + 'black' + '"></i> ' + 'réseau principal<br></div>';
        } else if (n_layer == 2) {
            div.innerHTML += '<div id="sr1"><i style="background:' + 'blue' + '"></i> ' + 'sous réseau1<br></div>';
        } else if(n_layer == 3) div.innerHTML += '<div id="sr2"><i  style="background:' + 'green' + '"></i> ' + 'sous réseau2<br></div>';

        return div;
    };

    
     div.style.display = "block";

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

function getdiametre(d) {
    if (d < 200) return 2;
    else return 5;

}

function getdash(q) {
    if (q=="Bonne") return '';
	
    else return '3';

}

//affichage dynamique selon le diamètre
function affichage_dynamique_diam(ev) {

    if (coche_d == 1) {
        reseau_p.eachLayer(function(reseau_p) {
            diametreValue = reseau_p.feature.properties.DIAMETRE;

            var diametre = getdiametre(diametreValue);


            reseau_p.setStyle({

                weight: diametre

            });
        });
        s_reseau1.eachLayer(function(s_reseau1) {
            diametreValue = s_reseau1.feature.properties.DIAMETRE;

            var diametre = getdiametre(diametreValue);


            s_reseau1.setStyle({

                weight: diametre

            });
        });
        s_reseau2.eachLayer(function(s_reseau2) {
            diametreValue = s_reseau2.feature.properties.DIAMETRE;

            var diametre = getdiametre(diametreValue);


            s_reseau2.setStyle({

                weight: diametre

            });
        });
		coche_d = 0;
		div.innerHTML += '<div id="diam_l1">' + '<br><span id="titre">Diamètre</span><br></div>'; 
		div.innerHTML += '<div id="diam_l2"><i style="background:' + 'black' + '"></i> ' + 'Moins de 0.2m<br></div>';
		div.innerHTML += '<div id="diam_l3"><i id="diam" style="background:' + 'black' + '"></i>' + 'Plus de 0.2m<br></div>';
    } else {
        reseau_p.setStyle({

            weight: 2

        });
        s_reseau1.setStyle({

            weight: 2

        });
        s_reseau2.setStyle({

            weight: 2

        });
		coche_d = 1;
	//enlever les diamètres de la légende
	var diam_l1 = document.getElementById("diam_l1");
	var diam_l2 = document.getElementById("diam_l2");
	var diam_l3 = document.getElementById("diam_l3");
     div.removeChild(diam_l1);
	 div.removeChild(diam_l2);
	 div.removeChild(diam_l3)

    }
    

}
//affichage dynamique selon la qualité
function affichage_dynamique_qual(ev) {
	 if (coche_q == 1) {

        s_reseau1.eachLayer(function(s_reseau1) {
            qualiteValue = s_reseau1.feature.properties.Qualite;

            var dash = getdash(qualiteValue);


            s_reseau1.setStyle({

                dashArray: dash

            });
        });
		
        s_reseau2.eachLayer(function(s_reseau2) {
            qualiteValue = s_reseau2.feature.properties.Qualite;

            var dash = getdash(qualiteValue);

            s_reseau2.setStyle({

                dashArray: dash

            });
        });
		 coche_q = 0;
	 
		div.innerHTML += '<div id="qual_l1">' + '<br><span id="titre">Niveau de qualité</span><br></div>'; 
		div.innerHTML += '<div id="qual_l2"><i style="background:' + 'black' + '"></i> ' + 'Bonne<br></div>';
		div.innerHTML += '<div id="qual_l3"><i id="dash"></i> ' + 'Avec défaut<br></div>';
    } else {
       
        s_reseau1.setStyle({

            dashArray: ''

        });
        s_reseau2.setStyle({

            dashArray: ''

        });
        coche_q = 1;
	//enlever les diamètres de la légende
	var qual_l1 = document.getElementById("qual_l1");
	var qual_l2 = document.getElementById("qual_l2");
	var qual_l3 = document.getElementById("qual_l3");
    div.removeChild(qual_l1);
	 div.removeChild(qual_l2);
	 div.removeChild(qual_l3);
	
}
}























