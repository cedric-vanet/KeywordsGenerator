/*
	keywordsGenerator plugin for jQuery
	Copyright (c) 2013 Cedric Vanet (cedric-vanet.fr)
	Version: 0.1
*/

(function($)
{ 
    $.fn.keywordsgenerator=function(options)
    {
    
       //Paramètres par defaut
       var defauts=
       {
         "min": 4,
         "max": 25,
         "words": 50,
         "tag": null,
         "alertmid": 40,
         "alertmax": true,
         "attachto": null,
         "callback": null
       };  
        
       //On fusionne les paramètres par defaut et les paramètres envoyés
       var parametres = $.extend(defauts, options); 
    	
    	 //Fonction
       return this.each(function()
       {

	        //A chaque rentrée de texte execution de la fonction
	        $(this).keyup(function()
	        {
	        	
	        	//Initialise les variables nécessaires
	        	var tabstrings = Array(), tabwords = Array(), text = $(this).val();	
	        	
	        	//Ecrase les anciens résultats
	        	parametres.attachto.val("").html(""); 
	        	
						//Si le parametre tag ne vaut pas null alors recupere tous les chaines présentes dans le texte avec ce type de tag, sinon recupere toutes le texte en intégralité
						if(parametres.tag){ 
							tabstrings = keywordsgenerator_striptag(text, parametres.tag);
						}else{
							if(text != ""){ tabstrings[0] = text; }
							else{ tabstrings = null; }
						}
						
						//Supprime les balises qui peuvent être présente dans les chaines du tableau
						tabstrings = keywordsgenerator_striphtml(tabstrings);
						
						if(tabstrings != null){
							
							//Traitement des chaines et extraction des mots
							tabwords = keywordsgenerator_stripword(tabstrings, parametres.min, parametres.max, parametres.words);
							
							//Convertir le tableau en chaine de caractere en séparant les cellules avec un ";"
							var nb_words = tabwords.length;
							tabwords = tabwords.join(';');
	
			        //Si le parametre attachto ne vaut pas null retour du resultat de la fonction avec .val() et .html() afin de s'adapter à l'élément de sortie
		          if(parametres.attachto){ 
		          	parametres.attachto.val(tabwords).html(tabwords); 
		          }else{ 
		          	alert("\"Attachto\" not present in the parameters of the function, so result : \n\n"+tabwords); 
		          }
		          
							//Alertes medium
							//if(nb_words == parametres.alertmid){ alert(parametres.alertmid); }
							
							//Alertes maximum
							//if(nb_words == parametres.words && parametres.alertmax == true){ alert("maximum"); }
		          
		        }
	        
						//Si le parametre callback ne vaut pas null execution de la fonction
	          if(parametres.callback){ parametres.callback(); }

	        });
        
       });  
                              
    };
})(jQuery);


function keywordsgenerator_stripword(tab, min, max, words){
	
	//Initialise les variables
	var tabwords = new Array(), tabtemp = new Array();
	
	//Parcours les chaines envoyés
	for(var i = 0, taille = tab.length; i < taille; i++){
		
		//Decoupe la chaine en mots dans un tableau
		tabtemp = tab[i].split(' ');	
		
		//Parcours le tableaux et traite les mots un par un
		for(var w = 0, tailletemp = tabtemp.length; w < tailletemp; w++){
			
			//Bloque le nombre de mots clés au maximum de words et retourne le tableau de mots clés
			if(tabwords.length == words){ return tabwords; }
			
			//Test la validité de la longueur du mot
			if(tabtemp[w].length >= min && tabtemp[w].length <= max){
				
				//Test de la présence d'accents
				var regex = new RegExp("[àáâãäåçèéêëìíîïðòóôõöùúûüýÿ]+", "gi");
				if(regex.test(tabtemp[w])) {
					
					//Création d'une copie du mot sans accent
					var new_word = keywordsgenerator_del_accent(tabtemp[w]);
					
					//Vérifie si le mot-clé existe déjà, sinon l'ajoute
					if(!keywordsgenerator_array_search(tabwords, new_word)){ tabwords.push(new_word); }
					
				};
							
				//Vérifie si le mot-clé existe déjà, sinon l'ajoute
				if(!keywordsgenerator_array_search(tabwords, tabtemp[w])){ tabwords.push(tabtemp[w]); }
				
			}
			
		}

	}
	
	//Retourne le tableau de mots clés
	return tabwords;
	
}


//Découpe un text pour récupérer sous forme de tableau les éléments contenu dans un tag spécifiques
function keywordsgenerator_striptag(text, tag){
	
	//Recompose le tag
	var tagstart = "<"+tag+">";
	var tagend = "</"+tag+">";
	var tabtemp = new Array();
	var tabwords = new Array();
	var temp = null;
	
	//Decoupe le texte en fonction des balises tag
	tabtemp = text.split(tagend);
	
	//Regex
	var regex = new RegExp(tagstart+"[/\\w\\t\\n\\r\\sàáâãäåçèéêëìíîïðòóôõöùúûüýÿ\\-._'\\\\,\"\\(\\)\<\>]+", "gi");
	
	for(var w = 0, tailletemp = tabtemp.length; w < tailletemp; w++){
		
		//Recupere les morceaux du texte avec ce tag
		temp = tabtemp[w].match(regex);
		
		//Enregistre le texte récupéré
		if(temp != null){ tabwords.push(temp); }
		
	}
	
	//Si aucune ocurrence
	if(tabwords == null){ 

		return null; 
		
	}else{
		
		return tabwords;
		
	}
	
}


//Supprimer dans les valeur d'un tableau les balises html éventuelles
function keywordsgenerator_striphtml(tab){

	var regex = new RegExp("(<([^>]+)>)", "gi");
	var temp = new String();
	
	if(tab != null){ 
		for (var i = 0, taille = tab.length; i < taille; i++){ 
			
			//Recupere en string la cellule du tableau
			temp = new String(tab[i]);
			
			//Passe la chaine en minuscule
			temp = keywordsgenerator_lowercase(temp);
			
			//Supprime les tags html
			tab[i] = temp.replace(regex, ""); 
		} 
	}
	
	return tab;
	
}

//Recherche dans un tableau l'occurence demande
function keywordsgenerator_array_search(tab, value){
	
	//Parcours les chaines envoyés
	for(var i = 0, taille = tab.length; i < taille; i++){
		if(tab[i] == value){ return true; }
	}
	
	return false;
	
}


//Supprime les accents d'une chaine
function keywordsgenerator_del_accent(value){ 
	
	var new_value = "", pattern_accent = new Array("à", "á", "â", "ã", "ä", "å", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï", "ð", "ò", "ó", "ô", "õ", "ö", "ù", "ú", "û", "ü", "ý", "ÿ"), pattern_replace_accent = new Array("a", "a", "a", "a", "a", "a", "c", "e", "e", "e", "e", "i", "i", "i", "i", "o", "o", "o", "o", "o", "o", "u", "u", "u", "u", "y", "y"); 
	
	if (value && value != "") { new_value = keywordsgenerator_preg_replace(pattern_accent, pattern_replace_accent, value); } 
	
	//Retourne la chaine sans accent
	return new_value;
		
}

		
//Remplacement de caractère dans une chaine
function keywordsgenerator_preg_replace(array_pattern, array_pattern_replace, value){
	
	var new_value = String(value); 
	
	for (var i = 0, taille = array_pattern.length; i < taille; i++){ 
		
		var reg_exp = RegExp(array_pattern[i], "gi"); 
		var val_to_replace = array_pattern_replace[i]; 
		new_value = new_value.replace (reg_exp, val_to_replace); 
		
	} 
	
	//Retourne la chaine avec les nouveau caractère
	return new_value; 
		
}

//Retourne une chaine en miniscule
function keywordsgenerator_lowercase(text){
	return text.toLowerCase(); 
}
