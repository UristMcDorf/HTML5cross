var columnCellCount = 0, columnHints, context, image, rowCellCount = 0, rowHints;


function GeneratePuzzle()
{
    var setLength = 0;

    rowHints = new Array(image.height);
    columnHints = new Array(image.width);
    
    for (var i = 0, hintCount = 0; i < image.height; i++)
    {
        rowHints[i] = "";
        var rowData = context.getImageData(0, i, image.width, 1);
        
        for (var j = 3; j < rowData.data.length; j += 4)
        {
            if (rowData.data[j] == 255)
            {
                setLength++;
            }
            else
            {
                if (setLength > 0)
                {
                    rowHints[i] = rowHints[i].concat(setLength + " ");
                    setLength = 0;
                    
                    hintCount++;
                }
            }
        }
        
        if (setLength > 0)
        {
            rowHints[i] = rowHints[i].concat(setLength);
            setLength = 0;
            
            hintCount++;
        }
        else
        {
            rowHints[i] = rowHints[i].trim();
        }
        
        if (hintCount > rowCellCount)
        {
            rowCellCount = hintCount;
        }
        hintCount = 0;
        
        if (rowHints[i] == "")
        {
            rowHints[i] = "0";
        }
    }
    
    for (var i = 0, hintCount = 0; i < image.width; i++)
    {
        columnHints[i] = "";
        var columnData = context.getImageData(i, 0, 1, image.height);
        
        for (var j = 3; j < columnData.data.length; j += 4)
        {
            if (columnData.data[j] == 255)
            {
                setLength++;
            }
            else
            {
                if (setLength > 0)
                {
                    columnHints[i] = columnHints[i].concat(setLength + " ");
                    setLength = 0;
                    
                    hintCount++;
                }
            }
        }
        
        if (setLength > 0)
        {
            columnHints[i] = columnHints[i].concat(setLength);
            setLength = 0;
            
            hintCount++;
        }
        else
        {
            columnHints[i] = columnHints[i].trim();
        }
        
        if (hintCount > columnCellCount)
        {
            columnCellCount = hintCount;
        }
        hintCount = 0;
        
        if (columnHints[i] == "")
        {
            columnHints[i] = "0";
        }
    }
    
    /*for (var i = 0; i < image.height; i++)
    {
        console.log("Row " + i + " hint: " + rowHints[i]);
    }
    console.log("Row cell count: " + rowCellCount);
    
    for (var i = 0; i < image.width; i++)
    {
        console.log("Column " + i + " hint: " + columnHints[i]);
    }
    console.log("Column cell count: " + columnCellCount);*/
    
    context.canvas.width = (image.width + rowCellCount) * 10 + 1;
    context.canvas.height = (image.height + columnCellCount) * 10 + 1;
}

function DrawGrid()
{
    for (var x = 0.5; x < context.canvas.width; x += 10)
    {
        context.moveTo(x, 0);
        context.lineTo(x, context.canvas.height);
    }
    
    for (var y = 0.5; y < context.canvas.height; y += 10)
    {
        context.moveTo(0, y);
        context.lineTo(context.canvas.width - 1, y);
    }
    
    context.strokeStyle = "#ccc";
    context.stroke();
}