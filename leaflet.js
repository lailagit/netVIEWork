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
window.onload = function() { //au chargement de la page

    var n_layer;
    var div = L.DomUtil.create('div', 'info legend'); //dclaration de la légende

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
                "weight": 5,
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
                "weight": 5,
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
                "color": "green",
                "weight": 5,
                "opacity": 1,
			


            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup( feature.properties.location + "<br>Matériel:" + feature.properties.material + "<br>Diamètre:" + feature.properties.diameter + "<br>Qualité:" + feature.properties.Qualite)
            }
        })

        controlLayers.addOverlay(s_reseau2, 'Sous réseau2');


    });




    //ajouter la legende

    var legend = L.control({
        position: 'bottomright'
    });

    legend.onAdd = function(map) {

        // loop through our density intervals and generate a label with a colored square for each interval
        if (n_layer == 1) {
            div.innerHTML += '<div id="rp"><i style="background:' + '#ff7800' + '"></i> ' + 'réseau principal<br></div>';
        } else if (n_layer == 2) {
            div.innerHTML += '<div id="sr1"><i style="background:' + 'blue' + '"></i> ' + 'sous réseau1<br>';
        } else div.innerHTML += '<div id="sr2"><i  style="background:' + 'green' + '"></i> ' + 'sous réseau2<br>';



        return div;
    };

    //legend.addTo(map);


    map.on('overlayadd', function(eventLayer) {
		div.style.display = "block";

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
    if (d < 200) return 3;
    else return 12;

}

function getopacity(q) {
	console.log(q);
    if (q=="Bonne") return 1;
	
    else return 0.3;

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
    } else {
        reseau_p.setStyle({

            weight: 5

        });
        s_reseau1.setStyle({

            weight: 5

        });
        s_reseau2.setStyle({

            weight: 5

        });

    }
    coche_d = 0;

}
//affichage dynamique selon la qualité
function affichage_dynamique_qual(ev) {
	 if (coche_q == 1) {

        s_reseau1.eachLayer(function(s_reseau1) {
            qualiteValue = s_reseau1.feature.properties.Qualite;

            var opacity = getopacity(qualiteValue);

console.log(opacity);
            s_reseau1.setStyle({

                opacity: opacity

            });
        });
		
        s_reseau2.eachLayer(function(s_reseau2) {
            qualiteValue = s_reseau2.feature.properties.Qualite;

            var opacity = getopacity(qualiteValue);

            s_reseau2.setStyle({

                opacity: opacity

            });
        });
    } else {
       
        s_reseau1.setStyle({

            opacity: 1

        });
        s_reseau2.setStyle({

            opacity: 1

        });

    }
    coche_q = 0;
}























