<?php
$nomsFichiers= array();
$dir = "donnees";
//  si le dossier pointe existe
if (is_dir($dir)) {

   // si il contient quelque chose
   if ($dh = opendir($dir)) {

       // boucler tant que quelque chose est trouve
       while (($file = readdir($dh)) !== false) {
       // élimine des fichiers se trouvant par défaut dans un 
	   //dossier quelconque et teste si le fichier est de type geojson
           if( $file != '.' && $file != '..'  && preg_match('#\.(geojson)$#i', $file)) {
          // élimine l'extension du fichier récuperé
		  $file2=pathinfo($file, PATHINFO_FILENAME);
		  //ajoute le nom au tableau nomFichiers
		  array_push($nomsFichiers, $file2);

           }
       }
       // on ferme la connection
       closedir($dh);
   }
}

/* $dir='donnees';
$fichiers= scandir($dir ); */
$envoi = json_encode($nomsFichiers);
echo $envoi;

?>
