function systemsetting(args) {
	var window = Titanium.UI.createWindow({
			backgroundColor: '#FFFFFF', 
			layout: 'vertical'
		}),
		filesPanel = Ti.UI.createTableView({
			headerTitle: 'Select a file',
			left: '2%',
			top: 4,
			width: '96%',
			borderWidth: 1,
			borderColor: '#cccccc'
		}),
		switchPanel = Titanium.UI.createView({
			layout: 'horizontal',
			width: '96%',
			left: '2%',
			height: 110,
			top: 10
		}),
		propertyLabel = Titanium.UI.createLabel({
			text: 'Select a type of property',
			color: '#000000',
			width: '48%'
		}),
		settingTypeSwitcher = Ti.UI.createPicker({
			left: '2%',
			width: '50%',
			height: '105'
		}),
		
		propertiesList = Ti.UI.createTableView({
			width: '100%',
			height: '100%',
			top: 0,
			left: 0,
			zIndex: 4
		}),
        settingType = Ti.Tizen.SystemSetting.SYSTEM_SETTING_TYPE_HOME_SCREEN,
        settingTypes = [];
    
    //settings data
    settingTypes.push(Ti.UI.createPickerRow({ title: Ti.Tizen.SystemSetting.SYSTEM_SETTING_TYPE_HOME_SCREEN, value: Ti.Tizen.SystemSetting.SYSTEM_SETTING_TYPE_HOME_SCREEN }));
	settingTypes.push(Ti.UI.createPickerRow({ title: Ti.Tizen.SystemSetting.SYSTEM_SETTING_TYPE_LOCK_SCREEN, value: Ti.Tizen.SystemSetting.SYSTEM_SETTING_TYPE_LOCK_SCREEN }));
	settingTypes.push(Ti.UI.createPickerRow({ title: Ti.Tizen.SystemSetting.SYSTEM_SETTING_TYPE_INCOMING_CALL, value: Ti.Tizen.SystemSetting.SYSTEM_SETTING_TYPE_INCOMING_CALL }));
	settingTypes.push(Ti.UI.createPickerRow({ title: Ti.Tizen.SystemSetting.SYSTEM_SETTING_TYPE_NOTIFICATION_EMAIL, value: Ti.Tizen.SystemSetting.SYSTEM_SETTING_TYPE_NOTIFICATION_EMAIL }));
    
    settingTypeSwitcher.add(settingTypes);

	switchPanel.add(propertyLabel);
	switchPanel.add(settingTypeSwitcher);
	window.add(switchPanel);
    window.add(filesPanel);
    
	//load images
	function loadFiles(type) {
		var source,
            isImage = type === Ti.Tizen.SystemSetting.SYSTEM_SETTING_TYPE_HOME_SCREEN || 
                      type === Ti.Tizen.SystemSetting.SYSTEM_SETTING_TYPE_LOCK_SCREEN,
			filter = Ti.Tizen.createAttributeFilter({
				attributeName: 'type',
				matchFlag: 'EXACTLY',
				matchValue: isImage ? 'IMAGE': 'AUDIO'
			});

		Ti.Tizen.Content.find( 
            //Success
            function(items) {
                var tableData = [],
                    i = 0,
                    length = items.length;
                
                Ti.API.info('loadImages => success');    
                for (; i < length; i++) {
                    
                    var item = items[i],
                        row = Ti.UI.createTableViewRow({
                            title: items[i].contentURI,
                            hasChild: false,
                            itemIdOwn: i
                        });
                    
                    tableData.push(row);
                }
                
                //clear listeners and rows
                filesPanel.removeEventListener('click');
                filesPanel.setData([]);
                
                //set new data and listener
                filesPanel.setData(tableData);
                filesPanel.addEventListener('click', function(e) {
                    Ti.API.info('click' + e.rowData.title);
                    //setProperty
                    Ti.Tizen.SystemSetting.setProperty( settingType, e.rowData.title, 
                        //successCallback
                        function() {
                            Titanium.UI.createAlertDialog({
                                title: 'System setting',
                                message: settingType + ' has been changed.'
                            }).show();  
                        },
                        //errorCallback
                        function(e) {
                            Titanium.UI.createAlertDialog({
                                title:'System setting',
                                message:e.message
                            }).show();
                        } 
                    );
                });
            },
            //Error
            function onError(e) {
                Ti.API.error(e.message);
            },
            null,
            filter
        );
	};
    
    loadFiles(settingType);

	settingTypeSwitcher.addEventListener('change', function(e) {
		Ti.API.info(e.row.value);
        
        settingType = e.row.value;
        loadFiles(settingType);
	});
	
	return window;
}

module.exports = systemsetting;