Oskari.registerLocalization(
{
    "lang": "fi",
    "key": "Analyse",
    "value": {
        "title": "Analyysi",
        "flyouttitle": "Analyysi",
        "desc": "",
        "NotLoggedView": {
            "discountedNotice": "(!) Nykyinen analyysityökalu ei valitettavasti toimi enää täydellisesti. Emme pysty tarjoamaan sen käyttöön tukea.",
            "text": "Analyysi-toiminnon avulla voit tehdä yksinkertaisia paikkatietoanalyyseja kohdetietoja sisältäville karttatasoille. Toiminto edellyttää kirjautumista.",
            "signup": "Kirjaudu sisään",
            "register": "Rekisteröidy"
        },
        "AnalyseView": {
            "title": "Analyysi",
            "content": {
                "label": "Karttatasot",
                "selectionToolsLabel": "Kohdetyökalut",
                "tooltip": "Valitse yksi aineisto analyysin pohjaksi. Lisää karttatasoja voit hakea \"Lisää karttatasoja\"-painikkeella aukeavalta listalta. Kohdista karttanäkymä haluamaasi paikkaan joko siirtämällä karttaa hiirellä tai klikkaamalla \"Hae paikkahaulla\" ja hakemalla haluamasi paikka.",
                "selectionToolsTooltip": "Lisää väliaikainen kohde, leikkaa olemassa olevaa kohdetta tai valitse kohteita rajaamalla niitä piirtämilläsi kuvioilla.",
                "noLayersSelected": "Ei valittuja karttatasoja",
                "noLayersForMethod": "Valitulle menetelmälle ei ole sopivia tasoja",
                "noProperties": "Tasolla ei ole ominaisuustietoja",
                "features": {
                    "title": "Lisäys",
                    "tooltips": {
                        "point": "Lisää väliaikainen piste käytettäväksi analyysin pohjana.",
                        "line": "Lisää väliaikainen viiva käytettäväksi analyysin pohjana.",
                        "area": "Lisää väliaikainen alue käytettäväksi analyysin pohjana."
                    },
                    "modes": {
                        "area": "Väliaikainen alue",
                        "line": "Väliaikainen viiva",
                        "point": "Väliaikainen piste"
                    }
                },
                "drawDialog": {
                    "point": {
                        "title": "Lisää väliaikainen piste",
                        "add": "Piirrä piste (tai pisteitä). Klikkaa haluamaasi sijaintia. Paina Valmis-painiketta. Tämän jälkeen piste näkyy Karttatasot-listalla nimellä Väliaikainen piste x, jossa x on pisteen järjestysnumero. Poista pisteet painamalla Peruuta -painiketta."
                    },
                    "line": {
                        "title": "Lisää väliaikainen viiva",
                        "add": "Piirrä viiva (tai viivoja). Klikkaa alkupistettä ja taitepisteitä. Lopuksi kaksoisklikkaa päätepistettä. Paina Valmis-painiketta. Tämän jälkeen viiva näkyy Karttatasot-listalla nimellä Väliaikainen viiva x, jossa x on viivan järjestysnumero. Poista viivat painamalla Peruuta -painiketta."
                    },
                    "area": {
                        "title": "Lisää väliaikainen alue",
                        "add": "Piirrä alue (tai alueita). Klikkaa kulmapisteitä. Lopuksi kaksoisklikkaa päätepistettä. Voit tehdä alueeseen reiällä pitämällä pohjassa ALT-näppäintä. Paina Valmis-painiketta. Tämän jälkeen alue näkyy Karttatasot-listalla nimellä Väliaikainen alue x, jossa x on alueen järjestysnumero. Poista alueet painamalla Peruuta -painiketta."
                    }
                },
                "selectionTools": {
                    "title": "Kohteiden valinta",
                    "description": "Valinta kohdistuu vain valittuun karttatasoon",
                    "filter": {
                        "all": "Kaikki kohteet",
                        "bbox": "Kartalla näkyvät kohteet",
                        "features": "Valitut kohteet tasolta",
                        "featuresTooltip": "Valitut kohteet näkyvät korostettuna kartalla ja kohdetietotaulukossa."
                    },
                    "button": {
                        "empty": "Poista valinnat"
                    }
                },
                "search": {
                    "title": "Hae kohteita",
                    "resultLink": "Käytä analyysissa"
                }
            },
            "method": {
                "label": "Menetelmä",
                "tooltip": "Valitse menetelmä, jota käytät analyysissa. Kunkin menetelmän kuvauksen voit lukea menetelmän kohdalta i-painikkeella.",
                "options": {
                    "buffer": {
                        "label": "Vyöhyke",
                        "tooltip": "Lisää vyöhyke valittujen kohteiden ympärille. Voit käyttää vyöhykkeitä muiden analyysien pohjana."
                    },
                    "aggregate": {
                        "label": "Tunnuslukujen laskenta",
                        "tooltip": "Laske tunnusluvut valituille kohteille. Tietosuojatut kohteet eivät ole mukana laskennassa."
                    },
                    "union": {
                        "label": "Yhdiste",
                        "tooltip": "Yhdistä valitut kohteet yhdeksi kohteeksi."
                    },
                    "clip": {
                        "label": "Leikkaus",
                        "tooltip": "Leikkaa kohteita toisen tason kohteilla. Lopputulokseen otetaan mukaan ne kohteet, jotka ovat leikkaavan tason kohteiden sisäpuolella."
                    },
                    "intersect": {
                        "label": "Leikkaavien kohteiden suodatus",
                        "tooltip": "Valitse leikattavalta tasolta ne kohteet, jotka ovat osittain tai kokonaan leikkaavan tason kohteiden sisällä."
                    },
                    "layer_union": {
                        "label": "Analyysitasojen yhdiste",
                        "tooltip": "Yhdistä valitut tasot. Tasoilla on oltavat samat ominaisuustiedot."
                    },
                    "areas_and_sectors": {
                        "label": "Vyöhykkeet ja sektorit",
                        "tooltip": "Lisää useita vyöhykkeitä ja sektoreita valittujen kohteiden ympärille."
                    },
                    "difference": {
                        "label": "Muutoksen laskenta",
                        "tooltip": "Laske muutos kahden eri karttatason välillä. Karttatasot esittävät samaa aineistoa eri aikoina."
                    },
                    "spatial_join": {
                        "label": "Yhdistäminen sijainnin perusteella",
                        "tooltip": "Yhdistä kohdetason ominaisuustiedot lähdetason ominaisuustietoihin kohteiden sijainnin perusteella."
                    }
                }
            },
            "aggregate": {
                "label": "Tunnusluku",
                "labelTooltip": "Valitse tunnusluvut, jotka lasketaan valittujen ominaisuustietojen perusteella.",
                "options": {
                    "Count" : "Kohteiden lukumäärä",
                    "Sum": "Summa",
                    "Min": "Pienin arvo",
                    "Max": "Suurin arvo",
                    "Average": "Keskiarvo",
                    "StdDev": "Keskihajonta",
                    "Median": "Mediaani",
                    "NoDataCnt": "Tietosuojattujen kohteiden lukumäärä"
                },
                "attribute": "Valitse ominaisuustieto",
                "footer": "Tietosuojatut kohteet eivät ole mukana laskennassa.",
                "aggregateAdditionalInfo": "Huom! Olet valinnut tekstiä sisältäviä ominaisuustietoja. Niille voi laskea ainoastaan kohteiden lukumäärän. Jos kohteiden lukumäärä ei ole valittuna, tekstiä sisältäviä ominaisuustietoja ei oteta mukaan analyysin lopputulokseen."
            },
            "buffer_size": {
                "label": "Vyöhykkeen koko",
                "labelTooltip": "Anna vyöhykkeen koko metreinä tai kilometreinä.",
                "tooltip": "Vyöhykkeen koko"
            },
            "buffer_units": {
                "m": "metriä",
                "km": "kilometriä"
            },
            "analyse_name": {
                "label": "Analyysin nimi",
                "labelTooltip": "Anna analyysille lopputulosta kuvaava nimi.",
                "tooltip": "Analyysin nimi"
            },
            "settings": {
                "label": "Parametrit",
                "tooltip": "Anna analyysille tarvittavat parametrit. Parametrit vaihtelevat valitun menetelmän ja suodatuksen mukaan."
            },
            "showFeatureData": "Avaa kohdetietotaulukko analyysin valmistuttua.",
            "showValuesCheckbox": "Näytä tunnusluvut tallentamatta tulosta.",
            "intersect": {
                "target": "Leikattava taso",
                "targetLabelTooltip": "Valitse taso, jonka kohteita leikataan leikkaavan tason kohteilla.",
                "label": "Leikkaava taso",
                "labelTooltip": "Valitse taso, jonka kohteilla leikataan leikattavan tason kohteita."
            },
            "union": {
                "label": "Yhdistettävä taso"
            },
            "layer_union": {
                "label": "Yhdistettävät tasot",
                "labelTooltip": "Valitse tasot, jotka yhdistetään. Tasojen kohteista muodostetaan yksi uusi taso.",
                "notAnalyseLayer": "Valittua tasoa ei voida käyttää analyysissa. Valitse toinen taso.",
                "noLayersAvailable": "Valituilla tasoilla ei ole samat ominaisuustiedot. Valitse tasot, joilla on samat ominaisuustiedot."
            },
            "areas_and_sectors": {
                "label": "Vyöhykkeet ja sektorit",
                "labelTooltip": "Määrittele vyöhykkeille koko ja lukumäärä sekä sektoreille lukumäärä.",
                "area_count": "Vyöhykkeiden lukumäärä",
                "area_count_tooltip": "Määrä välillä 0-{max}",
                "area_size": "Vyöhykkeiden koko",
                "area_size_tooltip": "Koko",
                "sector_count": "Sektorien lukumäärä",
                "sector_count_tooltip": "Määrä välillä 0-{max}"
            },
            "difference": {
                "firstLayer": "Aikaisempi ajankohta",
                "firstLayerTooltip": "Valitse taso, joka sisältää alkuperäiset tiedot.",
                "firstLayerFieldTooltip": "Valitse alkuperäiset tiedot sisältävältä tasolta ominaisuustieto, jonka tietoja verrataan muuttuneisiin tietoihin.",
                "secondLayer": "Myöhäisempi ajankohta",
                "secondLayerTooltip": "Valitse taso, joka sisältää muuttuneet tiedot.",
                "secondLayerFieldTooltip": "Valitse muuttuneet tiedot sisältävältä tasolta ominaisuustieto, jonka tietoja verrataan alkuperäisiin tietoihin.",
                "field": "Vertailtava ominaisuustieto",
                "keyField": "Yhdistävä ominaisuustieto",
                "keyFieldTooltip": "Valitse tasoja yhdistävä ominaisuustieto, joka määrittää yksiselitteisesti, mistä kohteesta on kyse."
            },
            "spatial": {
                "label": "Mukaan otettavat kohteet",
                "target": "Alkuperäinen taso",
                "targetTooltip": "Valitse taso, jolta valitaan ne kohteet, jotka leikkaavat leikkaavan tason kohteita.",
                "intersectingLayer": "Leikkaava taso",
                "intersectingLayerTooltip": "Valitse taso, jonka kohteiden perusteella valitaan kohteita alkuperäiseltä tasolta.",
                "labelTooltipIntersect": "Valitse, otetaanko mukaan alkuperäisen tason kohteet, jotka leikkaavat leikkaavan tason kohteita vai ovat kokonaan kohteiden sisäpuolella.",
                "options": {
                    "intersect": "Leikkaavat kohteet",
                    "contains": "Sisältyvät kohteet"
                }
            },
            "spatial_join": {
                "firstLayer": "Kohdetaso",
                "firstLayerTooltip": "Valitse kohdetaso eli taso, jonka ominaisuustietoihin lähdetasolta haetut ominaisuustiedot yhdistetään.",
                "firstLayerFieldTooltip": "Kohdetasolta mukaan otettavat ominaisuustiedot",
                "secondLayer": "Lähdetaso",
                "secondLayerTooltip": "Valitse lähdetaso eli taso, jonka ominaisuustiedoista yhdistettävät tiedot haetaan kohdetasolle.",
                "secondLayerFieldTooltip": "Lähdetasolta mukaan otettavat ominaisuustiedot",
                "mode": "Analyysimenetelmän tyyppi",
                "modeTooltip": "Valitse haluatko käyttää yhdistämisessä tunnuslukuja.",
                "normalMode": "Yhdistäminen sijainnin perusteella",
                "aggregateMode": "Tunnuslukujen laskenta",
                "backend_locale": [
                    {
                        "id": "count",
                        "label": "Kohteiden lukumäärä"
                    },
                    {
                        "id": "sum",
                        "label": "Summa"
                    },
                    {
                        "id": "min",
                        "label": "Pienin arvo"
                    },
                    {
                        "id": "max",
                        "label": "Suurin arvo"
                    },
                    {
                        "id": "avg",
                        "label": "Keskiarvo"
                    },
                    {
                        "id": "stddev",
                        "label": "Keskihajonta"
                    }
                ]
            },
            "params": {
                "label": "Mukaan otettavat ominaisuustiedot",
                "aggreLabel": "Ominaisuustiedot joille tunnusluvut lasketaan",
                "aggreLabelTooltip": "Valitse enintään {limit} ominaisuustietoa, joille lasketaan tunnusluvut.",
                "labelTooltip": "Valitse enintään {limit} ominaisuustietoa, jotka otetaan mukaan lopputulokseen.",
                "options": {
                    "all": "Kaikki",
                    "none": "Ei mitään",
                    "select": "Valitse listalta"
                }
            },
            "output": {
                "label": "Kohteiden esitystapa",
                "tooltip": "Määrittele esitystapa lopputuloksessa näytettäville pisteille, viivoille ja alueille.",
                "editStyle": "Muokkaa",
                "randomColor": "Satunnaiset värit",
                "defaultStyle": "Oletustyyli"
            },
            "buttons": {
                "analyse": "Tee analyysi",
                "data": "Lisää karttatasoja"
            },
            "success": {
                "layerAdded": "Analyysi on tehty. Karttatasoihin on lisätty uusi taso: {layer}. Myöhemmin löydät analyysin Omat tiedot -valikon Analyysit-välilehdeltä."
            },
            "error": {
                "title": "Virhe",
                "invalidSetup": "Annetuissa parametreissa on virheitä. Korjaa parametrit ja yritä uudelleen.",
                "noParameters": "Karttatasoa tai parametrejä ei ole määritelty. Valitse taso, jolle analyysi tehdään, ja menetelmässä käytettävät parametrit. Tämän jälkeen yritä uudelleen.",
                "noLayer": "Karttatasoa ei ole määritelty. Valitse taso, jolle analyysi tehdään, ja yritä uudelleen.",
                "noAnalyseUnionLayer": "Analyysitasojen yhdisteeseen tarvitaaan vähintään kaksi karttatasoa. Valitse toinen karttataso.",
                "invalidMethod": "Analyysimenetelmä on tuntematon. Valitse olemassa oleva menetelmä.",
                "bufferSize": "Vyöhykkeen koko on virheellinen. Korjaa vyöhykkeen koko ja yritä uudelleen.",
                "illegalCharacters": "Vyöhykkeen koossa on kiellettyjä merkkejä. Anna vyöhykkeen koko numeroina ja yritä uudelleen.",
                "nohelp": "Ohjetta ei löytynyt.",
                "saveFailed": "Analyysin tallennus epäonnistui.",
                "loadLayersFailed": "Analyysissa tarvittavia karttatasoja ei voitu hakea.",
                "loadLayerTypesFailed": "Analyysissa tarvittavia kohdetietoja ei voitu hakea karttatasolta.",
                "Analyse_parameter_missing": "Analyysissa tarvittavat parametrit puuttuvat. Anna parametrit ja yritä uudelleen.",
                "Unable_to_parse_analysis": "Annetuissa parametreissa on virheitä. Korjaa parametrit ja yritä uudelleen.",
                "Unable_to_get_WPS_features": "Analyysin lähtötietoja ei voitu hakea.",
                "WPS_execute_returns_Exception": "Analyysia ei voitu suorittaa.",
                "WPS_execute_returns_no_features": "Analyysin lopputuloksessa ei ole yhtään kohdetta.",
                "Unable_to_process_aggregate_union": "Yhdisteelle ei voitu laskea tunnuslukuja.",
                "Unable_to_get_features_for_union": "Lähtötietoja tunnuslukujen laskennalle ei voitu hakea.",
                "Unable_to_store_analysis_data": "Analyysin lopputulosta ei voitu tallentaa.",
                "Unable_to_get_analysisLayer_data": "Analyysin lähtötietoja ei voitu hakea.",
                "timeout": "Analyysin laskenta keskeytyi aikakatkaisun vuoksi.",
                "error": "Analyysi epäonnistui.",
                "parsererror": "Analyysin lopputuloksessa on virheitä.",
                "not_supported_wfs_maplayer" : "Analyysi toimii tällä hetkellä vain WFS:n versioilla 1.0.0 ja 1.1.0. Valitettavasti analyysi ei vielä toimi nyt käyttämälläsi rajapintatyypillä."
            },
            "infos": {
                "title": "Ominaisuustiedot",
                "layer": "Tason",
                "over10": "kohteilla on yli {limit} ominaisuustietoa. Valitse analyysin lopputulokseen enintään {limit} ominaisuustietoa. Valinnan voit tehdä parametrien valinnan yhteydessä.",
                "userlayer": "Omien aineistojen ominaisuustietoja ei voida käyttää analyyseissä, kohteiden geometrioilla voi kuitenkin tehdä analyysejä (vyöhyke, yhdiste, leikkaus)."
            },
            "aggregatePopup": {
                "title": "Analyysin tulokset",
                "property": "Ominaisuus"
            }
        },
        "StartView": {
            "discountedNotice": "(!) Nykyinen analyysityökalu ei valitettavasti toimi enää täydellisesti. Emme pysty tarjoamaan sen käyttöön tukea.",
            "text": "Analyysi-toiminnon avulla voit tehdä yksinkertaisia paikkatietoanalyyseja kohdetietoja sisältäville karttatasoille. Valmiit analyysit löytyvät Omat tiedot -valikon Analyysit-välilehdeltä.",
            "infoseen": {
                "label": "Älä näytä tätä viestiä uudelleen."
            },
            "buttons": {
                "continue": "Siirry analyysiin"
            }
        },
        "personalDataTab": {
            "grid": {
                "name": "Nimi",
                "delete": "Poista",
                "actions": "Toiminnot"
            },
            "title": "Analyysit",
            "confirmDeleteMsg": "Haluatko poistaa analyysin \"{name}\"?",
            "buttons": {
                "ok": "OK",
                "cancel": "Peruuta",
                "delete": "Poista"
            },
            "notification": {
                "deletedTitle": "Karttatason poisto",
                "deletedMsg": "Karttataso on poistettu"
            },
            "error": {
                "title": "Virhe",
                "generic": "Järjestelmässä tapahtui virhe."
            }
        }
    }
});
