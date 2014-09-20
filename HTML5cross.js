var columnHints, context, image, rowHints;


function GeneratePuzzle()
{
    var setLength = 0;

    rowHints = new Array(image.height);
    columnHints = new Array(image.width);
    
    for (var i = 0; i < image.height; i++)
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
                }
            }
        }
        
        if (setLength > 0)
        {
            rowHints[i] = rowHints[i].concat(setLength);
            setLength = 0;
        }
        else
        {
            rowHints[i] = rowHints[i].trim();
        }
        
        if (rowHints[i] == "")
        {
            rowHints[i] = "0";
        }
    }
    
    for (var i = 0; i < image.width; i++)
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
                }
            }
        }
        
        if (setLength > 0)
        {
            columnHints[i] = columnHints[i].concat(setLength);
            setLength = 0;
        }
        else
        {
            columnHints[i] = columnHints[i].trim();
        }
        
        if (columnHints[i] == "")
        {
            columnHints[i] = "0";
        }
    }
    
    for (var i = 0; i < image.height; i++)
    {
        console.log("Row " + i + " hint: " + rowHints[i]);
    }
    
    for (var i = 0; i < image.width; i++)
    {
        console.log("Column " + i + " hint: " + columnHints[i]);
    }
}