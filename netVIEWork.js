/*
Nom de l'application: netVIEWork
Description: affichage dynamique des réseaux enterrés
Auteurs: KAICHOUH-ZAROUGUI-PETIT
*/
//déclaration des variables globales
var layer;
var reseau_p;
var reseau = [];
var s_reseau = [];
var ancien_layer;
var coche_d = 1;
var coche_q = 1;
var val_diam = [];
var premiere = true;
var legend;
var map;
var x = 0;
var div = document.getElementById('div');
var titre_l = document.getElementById('titre_l');
//définition des plages de couleurs pour les sous réseaux
var couleurs = ['#046380', '#21177D', '#7E3300', '#5A5E6B', '#FCDC12', '#DB0073' /* ,'','','','','','','','' */ ];
//déclaration de la légende

var legend;
window.onload = function() { //au chargement de la page
    //ne pas afficher la légende du diamètre et de qualité au chargement de la page
    document.getElementById('leg_diam').style.display = "none";
    document.getElementById('leg_qual').style.display = "none";
    document.getElementById('option_q1').style.display = "none";
    document.getElementById('option_q2').style.display = "none";
    document.getElementById('text_q').style.fontWeight = "bold";
    document.getElementById('text_d').style.fontWeight = "bold";
    //définir la légende de qualité
    document.getElementById('leg_qual').innerHTML += '<div>' + '<br><span id="titre">Niveau de qualité</span><br></div>';
    document.getElementById('leg_qual').innerHTML += '<div><i class="back_leg" style="background:' + 'black' + '"></i> ' + '&nbsp;Bonne<br></div>';
    document.getElementById('leg_qual').innerHTML += '<div><i id="dash"></i> ' + 'Avec défaut<br></div>';
    //définir la légende de qualité
    document.getElementById('leg_diam').innerHTML += '<div id="diam_l1">' + '<br><span id="titre">Diamètre</span><br></div>';
    var n_layer;


    map = L.map("map", { //délclaration de la carte 
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


    carte.addTo(map); //la carte de base comme vue initiale
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


        titre_l.innerHTML += /* '<div>' + */ '<nav onclick="ouvrirFermerSpoiler(infoslegende)"> <span class="glyphicon glyphicon-chevron-up">' +
            '</span>Légende</nav>';

        return div;
    };
    legend.addTo(map);

    //	Récupérer tous les réseaux(fichiers.geojson) du chemain indiqué
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "fichiers.php", true);

    xhr.send();
	
    xhr.addEventListener('readystatechange', function(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            b = JSON.parse(xhr.responseText);


            for (var j = 0; j < b.length; j++) {

                (function(j) {
					//Récupérer les sous réseaux
                    var result = b[j].indexOf('Reseau_principal');
                    if (result == -1) {
                        var chemin = "donnees/" + b[j] + ".geojson";
                        var color = choisir_couleur();
                        //Récupérer le réseau et définir son style
                        layer = $.getJSON(chemin, function(data) {
                            reseau[j] = L.geoJson(data, {
                                style: {
                                    "color": color,
                                    "weight": 3,
                                    "opacity": 1
                                },


                                onEachFeature: function(feature, layer) {
                                    //afficher les poup au survol des tronçons du sous réseau
                                    layer.bindPopup("Location: " + feature.properties.location + "<br>Matériel:" + feature.properties.material + "<br>Diamètre:" + feature.properties.diameter + "<br>Qualité:" + feature.properties.Qualite)
                                    layer.on('mouseover', function() {
                                        ancien_layer = layer;
                                        layer.openPopup();
                                        layer.setStyle({
                                            color: '#666',

                                        });
                                    });
                                    layer.on('mouseout', function() {
                                        layer.closePopup();
                                        layer.setStyle({
                                            color: ancien_layer.options.style.color,
                                        });

                                    });



                                }


                            })

                            infoslegende.innerHTML += '<div id="sr"><input class="cb" id=' + j + ' type="checkbox" value=""onclick="activer(event,reseau[' + j + '],' + j + ' )"><i class="barrel" style="background:' + color + '"></i> <span class="l_text">' + b[j] + '</span><br></div>';
                            s_reseau.push(reseau[j]);
                        });
                    } else {
                        //chargement du réseau principal
                        layer = $.getJSON("donnees/Reseau_principal.geojson", function(data) {
                    
                            reseau_p = L.geoJson(data, {
                                    style: {
                                        "color": '#FFA500',
                                        "weight": 6,
                                        "opacity": 1


                                    },
									 //afficher les poup au survol des tronçons du réseau
                                    onEachFeature: function(feature, layer) {
                                        layer.bindPopup("Matériel: " + feature.properties.MATERIAU + "<br>Diamètre:" + feature.properties.DIAMETRE)
                                        layer.on('mouseover', function() {
                                            ancien_layer = layer;
                                            layer.openPopup();
                                            layer.setStyle({
                                                color: '#666',

                                            });
                                        });
                                        layer.on('mouseout', function() {
                                            layer.closePopup();
                                            layer.setStyle({
                                                color: ancien_layer.options.style.color,
                                            });

                                        });

                                    }
                                })
                            //zommer la carte sur le réseau principal
                            map.fitBounds(reseau_p.getBounds());
                            infoslegende.innerHTML += '<div id="rp"><input class="cb" id=' + j + ' type="checkbox" value=""onclick="activer(event,reseau_p,' + j + '  )"><i  class="barrel" style="background:' + '#FFA500' + '"></i><span class="l_text"> ' + b[j] + '</span><br></div>';

                        });

                    }
                })(j);

            }
        }
    });


}

//fonction d'activation des couches

function activer(event, reseau, j) {

    (function(ev, res) {

        if (document.getElementById(j).checked) {

            res.addTo(map);
            if (res == reseau_p) reseau_p.bringToBack();

        } else {

            map.removeLayer(res);


        }

    })(event, reseau)
}
//fonction qui récupère les diamètres de tous les réseaux 
function getdiametre(d) {
    if (!contains.call(val_diam, d) & d != null & d != 0) {
        //récupérer tous les diamètres dans un tableau val_diam
        val_diam.push(d);
    }
    return d / 100;

}
//fonction qui retourne le style de trait selon la qualité du tronçon
function getdash(q) {
    if (q == "Bonne") return '';

    else return '4';

}

//affichage dynamique selon le diamètre 
function affichage_dynamique_diam(ev) {


    if (coche_d == 1) { //lors de l'activation du checkbox diamètre
        if (document.getElementById('qual').checked) {
            document.getElementById('text_d').style.color = "black";
            document.getElementById('text_q').style.color = "black";
        } else document.getElementById('text_q').style.color = "#808080";
        document.getElementById('leg_diam').style.display = "block";

        reseau_p.eachLayer(function(reseau_p) {
            diametreValue = reseau_p.feature.properties.DIAMETRE;

            var diametre = getdiametre(diametreValue);


            reseau_p.setStyle({

                weight: diametre

            });
        });
        for (var i = 0; i < s_reseau.length; i++) {
            var ss_reseau = s_reseau[i];
            s_reseau[i].eachLayer(function(ss_reseau) {
                diametreValue = ss_reseau.feature.properties.DIAMETRE;

                var diametre = getdiametre(diametreValue);


                ss_reseau.setStyle({

                    weight: diametre

                });
            });
        }

        coche_d = 0;
        if (premiere) {
            //trier le tableau des diamètres
            val_diam.sort(compare);

            for (var i = 0; i < val_diam.length; i++) {
                //afficher les diamètres dans la légende
                document.getElementById('leg_diam').innerHTML += '<div><i class="back_leg" style="background:' + 'black;height:' + val_diam[i] / 100 + 'px' + '"></i> ' + '&nbsp;Diamètre:' + val_diam[i] + 'mm<br></div>';
            }
        }
        premiere = false;
    } else {
		//remettre le style initial en décochant
        reseau_p.setStyle({

            weight: 6

        });
        for (var i = 0; i < s_reseau.length; i++) {
            s_reseau[i].setStyle({

                weight: 2

            });
        }

        coche_d = 1;
        //enlever la legnende 
        document.getElementById('leg_diam').style.display = "none";
        if (document.getElementById('qual').checked) document.getElementById('text_d').style.color = "#808080";
        else document.getElementById('text_q').style.color = "black";

    }


}

//vérifier si un tableu contient un élément
var contains = function(needle) {
    var findNaN = needle !== needle;
    var indexOf;

    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1,
                index = -1;

            for (i = 0; i < this.length; i++) {
                var item = this[i];

                if ((findNaN && item !== item) || item === needle) {
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
        if (document.getElementById('diam').checked) {
            document.getElementById('text_q').style.color = "black";
            document.getElementById('text_d').style.color = "black";
        } else document.getElementById('text_d').style.color = "#808080";
        document.getElementById('leg_qual').style.display = "block";
        document.getElementById('option_q1').style.display = "block";
        document.getElementById('option_q2').style.display = "block";
        for (var i = 0; i < s_reseau.length; i++) {
            var ss_reseau = s_reseau[i];

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
        for (var i = 0; i < s_reseau.length; i++) {
			//Remettre le style initial en décochant

            s_reseau[i].setStyle({

                dashArray: ''

            });
        }

        coche_q = 1;
		//Enlever la légende de qualité

        document.getElementById('leg_qual').style.display = "none";
        document.getElementById('option_q1').style.display = "none";
        document.getElementById('option_q2').style.display = "none";
        if (document.getElementById('diam').checked) document.getElementById('text_q').style.color = "#808080";
        else document.getElementById('text_d').style.color = "black";
    }
}


//fonction qui permet de choisir les couleurs pour les sous réseaux

function choisir_couleur() {
    couleur = couleurs[x];
    x++
    return couleur;
}
//fonction qui déplie la légende
function ouvrirFermerSpoiler(elem) {
    if ($(elem).attr('id') === "infoslegende") {
        if (elem.style.display == 'none') {
            elem.style.display = 'block';
            titre_l.innerHTML = /* '<div>' + */ '<nav onclick="ouvrirFermerSpoiler(infoslegende)"> <span class="glyphicon glyphicon-chevron-up">' +
                '</span>Légende</nav>';
        } else {
            elem.style.display = 'none';
            titre_l.innerHTML = /* '<div>' + */ '<nav onclick="ouvrirFermerSpoiler(infoslegende)"> <span class="glyphicon glyphicon-chevron-down">' +
                '</span>Légende</nav>';
        }
    } else {
        if (elem.style.display == 'none') {
            elem.style.display = 'block';
        } else {
            elem.style.display = 'none';

        }
    }

}