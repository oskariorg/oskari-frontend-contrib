Oskari.registerLocalization(
{
    "lang": "en",
    "key": "Analyse",
    "value": {
        "title": "Analysis",
        "flyouttitle": "Analysis",
        "desc": "",
        "btnTooltip": "Analysis",
        "NotLoggedView": {
            "discountedNotice": "(!) Current Analysis tool is unfortunately not working properly. We are not able to provide user support for it.",
            "text": "With Analysis function you can make simple spatial analysis for map layers including feature data. The function is available only for logged-in users.",
            "signup": "Log in",
            "register": "Register"
        },
        "AnalyseView": {
            "title": "Analysis",
            "content": {
                "label": "Map Layers",
                "selectionToolsLabel": "Feature Tools",
                "tooltip": "Select one map layer for analysis. You can search more map layers by clicking \"Add map layer\" and selecting a map layer from the list. You can focus your map view to the place you  want by dragging the map with a mouse or by clicking \"Search places\" and searching the place you want.",
                "selectionToolsTooltip": "Add a temporary feature, clip an existing feature or select features with a geometry you draw.",
                "noLayersSelected": "No map layers selected",
                "noLayersForMethod": "No suitable map layers for method",
                "noProperties": "Layer doesn't have properties",
                "features": {
                    "title": "Add Feature",
                    "buttons": {
                        "cancel": "Cancel",
                        "finish": "Done"
                    },
                    "tooltips": {
                        "point": "Add a temporary point to be used in the analysis.",
                        "line": "Add a temporary line to be used in the analysis.",
                        "area": "Add a temporary area to be used in the analysis."
                    },
                    "modes": {
                        "area": "Temporary area",
                        "line": "Temporary line",
                        "point": "Temporary point"
                    }
                },
                "drawDialog": {
                    "point": {
                        "title": "Add Point",
                        "add": "Draw one or more points. Click the map. Press the \"Done\" button. The point(s) will be added to the Map Layer list at the analysis function. The point's name is \"Temporary point X\", where X is an order number. You can remove point(s) by pressing the \"Cancel\" button."
                    },
                    "line": {
                        "title": "Add Line",
                        "add": "Draw one or more lines. Click a starting point and breaking points. Finally double-click an ending point. Press the \"Done\" button. The line(s) will be added to the Map Layer list at the analysis function. The line's name is \"Temporary line X\", where X is an order number. You can remove line(s) by pressing the \"Cancel\" button."
                    },
                    "area": {
                        "title": "Add Area",
                        "add": "Draw one or more areas. Click corner points. Finally double-click an ending point. You can make a hole to the area by pressing alt-key in the keyboard. Press the \"Done\" button. The area(s) will be added to the Map Layer list at the analysis function. The area's name is \"Temporary line X\", where X is an order number. You can remove area(s) by pressing the \"Cancel\" button."
                    }
                },
                "drawFilter": {
                    "title": "Clipping",
                    "buttons": {
                        "cancel": "Cancel",
                        "finish": "Done"
                    },
                    "tooltip": {
                        "point": "Draw an intersection point to clip the selected line.",
                        "line": "Draw an intersection line to clip the selected area.",
                        "edit": "Draw an intersection area to clip the selected area.",
                        "remove": "Remove all intersections without saving them."
                    },
                    "dialog": {
                        "modes": {
                            "point": {
                                "title": "Intersection Point for Line",
                                "message": "Clip the line to two lines with intersection points. Intersection points are marked with red diamonds. If the line is circular, intersection points are on top of one another. Move the intersection points by dragging them with a mouse. The result is highlighted with red. Finally press the \"Done\" button."
                            },
                            "line": {
                                "title": "Intersection Line for Area",
                                "message": "Clip the area to two areas with an intersection line. Draw a line over the area. Click breaking points (including a starting point). Finally double-click an ending point. You can move breaking points by dragging them with a mouse. The result area is highlighted with blue. You can change a highlighted area by clicking another area. Finally press the \"Done\" button."
                            },
                            "edit": {
                                "title": "Intersection Area for Area",
                                "message": "Clip the area to two areas with an intersection line. Draw an area over the area. Click corner points (including a starting point). Finally double-click an ending point. You can move breaking points by dragging them with a mouse. The result area is highlighted with blue. You can change a highlighted area by clicking another area. Finally press the \"Done\" button."
                            }
                        }
                    }
                },
                "selectionTools": {
                    "title": "Select features",
                    "description": "Select features geometrically. Define the features to be selected by drawing a geometry. The selection applies only to the selected map layer.",
                    "filter": {
                        "all": "All features",
                        "bbox": "Features visible on the map",
                        "features": "Features selected on the layer",
                        "featuresTooltip": "Selected features are highlighted on the map and feature data table."
                    },
                    "button": {
                        "empty": "Remove Selection"
                    }
                },
                "search": {
                    "title": "Search places",
                    "resultLink": "Use in analysis"
                }
            },
            "method": {
                "label": "Method",
                "tooltip": "Select a method to be used in the analysis. You can read guidance for one method by clicking the i-icon next to its name.",
                "options": {
                    "buffer": {
                        "label": "Buffer",
                        "tooltip": "Add buffer around the selected features. You can use buffers in other analysis."
                    },
                    "aggregate": {
                        "id": "oskari_analyse_aggregate",
                        "label": "Descriptive statistic",
                        "classForPreview": "aggregate",
                        "tooltip": "Compute descriptive statistic for the selected features. Authorised features are not included in the analysis."
                    },
                    "union": {
                        "label": "Union",
                        "tooltip": "Join the selected features in one new feature."
                    },
                    "clip": {
                        "label": "Clipping",
                        "tooltip": "Clip the selected features with features on the clipping layer. Only the features inside the features on the clipping layer are included in the result."
                    },
                    "intersect": {
                        "label": "Geometric filter",
                        "tooltip": "Select features from the layer to be intersected. The features partially or totally inside the features on the intersecting layer are selected."
                    },
                    "layer_union": {
                        "label": "Analysis Layer Union",
                        "tooltip": "Combine the selected map layers. You can combine them only if they have same attributes."
                    },
                    "areas_and_sectors": {
                        "label": "Buffers and sectors",
                        "tooltip": "Add buffers and sectors around the selected features."
                    },
                    "difference": {
                        "label": "Difference Computation",
                        "tooltip": "Compute a difference between two map layers. Map layers present the same location at two different times."
                    },
                    "spatial_join": {
                        "label": "Spatial join",
                        "tooltip": "Join attribute data of two different layers. Feature attributes are joined based on location."
                    }
                }
            },
            "aggregate": {
                "label": "Descriptive statistic",
                "labelTooltip": "Select descriptive statistic to be computed based on feature attributes.",
                "options": {
                    "Count" : "Feature count",
                    "Sum": "Sum",
                    "Min": "Minimum",
                    "Max": "Maximum",
                    "Average": "Average",
                    "StdDev": "Standard deviation",
                    "Median": "Median",
                    "NoDataCnt": "Count of authorised features"
                },
                "attribute": "Select attribute",
                "footer": "Authorised features are not included in the analysis.",
                "aggregateAdditionalInfo": "Note! You have selected one or more attributes containing textual data. Only the feature count can be calculated for them. If the feature count is not selected, textual attribute data are not included in the analysis result."
            },
            "buffer_size": {
                "label": "Buffer size",
                "labelTooltip": "Type a buffer size as meters or kilometers.",
                "tooltip": "Buffer size"
            },
            "buffer_units": {
                "m": "meters",
                "km": "kilometers"
            },
            "analyse_name": {
                "label": "Analysis name",
                "labelTooltip": "Type a descriptive name for the analysis.",
                "tooltip": "Analysis name"
            },
            "settings": {
                "label": "Parameters",
                "tooltip": "Give parameters for the analysis. Parameters depend on the selected filter and method."
            },
            "showFeatureData": "Open feature data after finishing analysis.",
            "showValuesCheckbox": "Show descriptive statistic without saving the result.",
            "intersect": {
                "target": "Layer to be intersected",
                "targetLabelTooltip": "Select a map layer to be intersected with features on the intersecting layer.",
                "label": "Intersecting layer",
                "labelTooltip": "Select an intersecting layer. The features will be selected based on the features on this layer."
            },
            "union": {
                "label": "Layer to be combined"
            },
            "layer_union": {
                "label": "Layers to be combined",
                "labelTooltip": "Select map layers to be combined. Combined features will be saved into a new map layer.",
                "notAnalyseLayer": "The selected map layer cannot be used in analysis. Please select another map layer.",
                "noLayersAvailable": "The selected map layers do not have same attributes. Please select map layers with same attributes."
            },
            "areas_and_sectors": {
                "label": "Buffers and sectors",
                "labelTooltip": "Define a size and a number of buffers and a number of sectors.",
                "area_count": "Buffer count",
                "area_count_tooltip": "Count between 0-{max}",
                "area_size": "Buffer size",
                "area_size_tooltip": "Size",
                "sector_count": "Sector count",
                "sector_count_tooltip": "Count between 0-{max}"
            },
            "difference": {
                "firstLayer": "Older map layer",
                "firstLayerTooltip": "Select the map layer containing the original data.",
                "firstLayerFieldTooltip": "Select a comparable attribute from the older map layer.",
                "secondLayer": "Newer map layer",
                "secondLayerTooltip": "Select the map layer containing the updated data.",
                "secondLayerFieldTooltip": "Select a comparable attribute from the newer map layer.",
                "field": "Comparable attribute",
                "keyField": "Combining attribute",
                "keyFieldTooltip": "Select a combining attribute. It must be an unique identifier for both of map layer."
            },
            "spatial": {
                "label": "Result features",
                "target": "Original layer",
                "targetTooltip": "Select a original layer. The features will be selected from this layer.",
                "intersectingLayer": "Intersecting layer",
                "intersectingLayerTooltip": "Select an intersecting layer. The features will be selected based on the features on this layer.",
                "labelTooltipIntersect": "Select which features are included into the result. Intersecting features are at least partially inside the features on the intersecting layer, containing features totally inside. This method is designed for point features. Please use the operator \"Containing features\" for areas. Otherwise the result may have errors.",
                "options": {
                    "intersect": "Intersecting features",
                    "contains": "Containing features"
                }
            },
            "spatial_join": {
                "firstLayer": "Feature Layer",
                "firstLayerTooltip": "Select a feature map layer. Its attribute data will be combined with attribute data from the source layer.",
                "firstLayerFieldTooltip": "Result attributes from feature layer",
                "secondLayer": "Source Layer",
                "secondLayerTooltip": "Select a source map layer. Its attribute data will be retrieved into the feature level.",
                "secondLayerFieldTooltip": "Result attributes from source layer",
                "mode": "Spatial join mode",
                "modeTooltip": "Select if you want to use descriptive statististic in the spatial join.",
                "normalMode": "Normal spatial join",
                "aggregateMode": "Aggregate descritpive statistic",
                "backend_locale": [
                    {
                        "id": "count",
                        "label": "Feature count"
                    },
                    {
                        "id": "sum",
                        "label": "Sum"
                    },
                    {
                        "id": "min",
                        "label": "Minimum"
                    },
                    {
                        "id": "max",
                        "label": "Maximum"
                    },
                    {
                        "id": "avg",
                        "label": "Average"
                    },
                    {
                        "id": "stddev",
                        "label": "Standard deviation"
                    }
                ]
            },
            "params": {
                "label": "Attributes in the result",
                "aggreLabel": "Attributes for descriptive statistic",
                "aggreLabelTooltip": "Select at most ten attributes. Descriptive statistic are computed for these attributes.",
                "labelTooltip": "Select at most ten attributes into the result.",
                "tooltip": "Give analysis method appropriate parameters.",
                "options": {
                    "all": "All",
                    "none": "None",
                    "select": "Select from list"
                }
            },
            "output": {
                "label": "Feature style",
                "tooltip": "Select a style for points, lines and areas in the result.",
                "editStyle": "Edit",
                "randomColor": "Random colours",
                "defaultStyle": "Default style"
            },
            "buttons": {
                "save": "Save and finish",
                "analyse": "Make analysis",
                "data": "More map layers"
            },
            "help": "Help",
            "success": {
                "layerAdded": {
                    "title": "Analysis succeeded.",
                    "message": "Analysis has been done. The result is at the map layer {layer}. Later you can find your analysis in the My data menu."
                }
            },
            "error": {
                "title": "Error",
                "invalidSetup": "Parameters are invalid. Please correct them and try again.",
                "noParameters": "The map layer and parameters are not defined. Please select a map layer and parameters to be used in the analysis, and try again.",
                "noLayer": "The map layer is not selected. Please select a map layer and try again.",
                "noAnalyseUnionLayer": "You need at least two map layers for this method. Please select another layer and try again.",
                "invalidMethod": "The analysis method is unknown. Please select an existing method.",
                "bufferSize": "The buffer size is invalid. Please correct it and try again.",
                "illegalCharacters": "The buffer size has illegal characters. Please correct it and try again.",
                "nohelp": "The guide was not found.",
                "saveFailed": "The analysis could not be saved.",
                "loadLayersFailed": "The map layers could not be loaded.",
                "loadLayerTypesFailed": "The attribute data could not be loaded.",
                "Analyse_parameter_missing": "Parameter(s) are missing. Please give them and try again.",
                "Unable_to_parse_analysis": "Parameter(s) are invalid. Please correct them and try again.",
                "Unable_to_get_WPS_features": "The source data could not be retrieved.",
                "WPS_execute_returns_Exception": "The analysis could not be processed.",
                "WPS_execute_returns_no_features": "The result has no features.",
                "Unable_to_process_aggregate_union": "Descriptive statistic could not be computed for the union.",
                "Unable_to_get_features_for_union": "The source data could not be retrieved.",
                "Unable_to_store_analysis_data": "The analysis result could not be saved.",
                "Unable_to_get_analysisLayer_data": "The source data could not be retrieved.",
                "timeout": "Processing the analysis could not be finished because of a time-out error.",
                "error": "The analysis failed.",
                "parsererror": "The result data are invalid.",
                "not_supported_wfs_maplayer": "Analysis works currently only with WFS 1.0.0 and 1.1.0. Unfortunately analysis does not work yet with the API version you have selected."
            },
            "infos": {
                "title": "Attributes",
                "layer": "Features on the layer",
                "over10": "have over ten attributes. Please select at most ten attributes into the analysis result. The attributes you can select in the parameters.",
                "userlayer": "The attribute data from own datasets cannot be used in analyses. Geometries can still be used (buffer, union, clip)."
            },
            "aggregatePopup": {
                "title": "Analysis results",
                "property": "Property",
                "store": "Save",
                "store_tooltip": "Save result geometry as temporary layer",
                "close": "Close"
            }
        },
        "StartView": {
            "discountedNotice": "(!) Current Analysis tool is unfortunately not working properly. We are not able to provide user support for it.",
            "text": "With this function you can make simple spatial analysis for map layers including feature data. The finished analysis you can find at the tab Analysis in the menu Own data.",
            "layersWithFeatures": "You can make analysis only for one map layer. Select the map layer. Other selections are removed.",
            "infoseen": {
                "label": "Do not show this message again."
            },
            "buttons": {
                "continue": "Start analysis",
                "cancel": "Cancel"
            }
        },
        "personalDataTab": {
            "grid": {
                "name": "Name",
                "delete": "Remove",
                "actions": "Actions"
            },
            "title": "Analysis",
            "confirmDeleteMsg": "Do you want to remove the analysis layer \"{name}\"?",
            "buttons": {
                "ok": "OK",
                "cancel": "Cancel",
                "delete": "Remove"
            },
            "notification": {
                "deletedTitle": "Remove Analysis Layer",
                "deletedMsg": "Analysis layer has been removed."
            },
            "error": {
                "title": "Error",
                "generic": "The system error occurred."
            }
        }
    }
});
