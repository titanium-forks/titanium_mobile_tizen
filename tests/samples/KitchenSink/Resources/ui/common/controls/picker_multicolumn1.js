function picker_multi1() {
	var win = Ti.UI.createWindow();
	win.backgroundColor = 'black';
	
	var picker = Ti.UI.createPicker({
		width: '150',
		height: '110',
		color: '#fc0'
	});
	
	//var column1 = Ti.UI.createPickerColumn({opacity:0});
	var column1 = Ti.UI.createPickerColumn();
	column1.addRow(Ti.UI.createPickerRow({title:'Bananas',custom_item:'b'}));
	column1.addRow(Ti.UI.createPickerRow({title:'Strawberries',custom_item:'s', selected:true}));
	column1.addRow(Ti.UI.createPickerRow({title:'Mangos',custom_item:'m'}));
	column1.addRow(Ti.UI.createPickerRow({title:'Grapes',custom_item:'g'}));
	
	var column2 = Ti.UI.createPickerColumn();
	column2.addRow(Ti.UI.createPickerRow({title:'red'}));
	column2.addRow(Ti.UI.createPickerRow({title:'green'}));
	column2.addRow(Ti.UI.createPickerRow({title:'blue'}));
	column2.addRow(Ti.UI.createPickerRow({title:'orange'}));
	
	// 2 columns as an array
	picker.add([column1,column2]);
	
	
	// turn on the selection indicator (off by default)
	picker.selectionIndicator = true;
	
	win.add(picker);
	
	var label = Ti.UI.createLabel({
		text:'Make a move',
		top:10,
		width:'auto',
		height:'auto',
		textAlign:'center',
		color:'white'
	});
	win.add(label);
	
	
	picker.addEventListener('change',function(e)
	{
		Ti.API.info("You selected row: "+e.row+", column: "+e.column+", custom_item: "+e.row.custom_item);
		label.text = "row index: "+e.rowIndex+", column index: "+e.columnIndex;
	});
	
	return win;
}

module.exports = picker_multi1;
