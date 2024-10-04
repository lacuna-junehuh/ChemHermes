<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChemHermes 3D Molecule Viewer</title>
    <script src="https://3dmol.org/build/3Dmol-min.js"></script>
    <style>
        #mol3d {
            width: 500px;
            height: 500px;
            border: 2px solid white;
            margin: 20px auto;
        }
        h1, p {
            text-align: center;
            font-family: Arial, sans-serif;
        }
        #fileForm {
            text-align: center;
            margin: 20px;
        }
    </style>
</head>
<body>
    <h1>ChemHermes 3D Molecule Viewer</h1>
    <p>Upload a PDB or SDF file to view the molecule</p>

    <div id="fileForm">
        <input type="file" id="moleculeFile" accept=".pdb,.sdf">
        <select id="styleSelect">
            <option value="cartoon">Cartoon</option>
            <option value="stick">Stick</option>
            <option value="ball&stick">Ball & Stick</option>
        </select>
        <button id="uploadBtn">Upload and Render</button>
    </div>

    <div id="mol3d"></div> <!-- This is where the molecule will be displayed -->
    
    <script>
        const uploadButton = document.getElementById('uploadBtn');
        const moleculeFileInput = document.getElementById('moleculeFile');
        const styleSelect = document.getElementById('styleSelect');
        const viewerElement = document.getElementById('mol3d');

        let viewer = $3Dmol.createViewer(viewerElement, {
            backgroundColor: 'white',
            width: '100%',
            height: '100%',
        });

        // Function to determine if the molecule is small
        function isSmallMolecule(pdbData) {
            const atomCount = (pdbData.match(/^ATOM\s/gm) || []).length;
            const hasHelix = pdbData.includes('HELIX');
            const hasSheet = pdbData.includes('SHEET');
            return atomCount < 50 && !hasHelix && !hasSheet;
        }

        // Handle file upload and rendering
        uploadButton.addEventListener('click', () => {
            const file = moleculeFileInput.files[0];
            if (!file) {
                alert('Please select a molecule file.');
                return;
            }

            const selectedStyle = styleSelect.value;

            const reader = new FileReader();
            reader.onload = function(event) {
                const fileContent = event.target.result;

                // Send the file content and style to the Netlify function
                fetch('/.netlify/functions/uploadMolecule', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        file_content: fileContent,
                        style: selectedStyle,
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('File data received:', data);

                    const moleculeData = data.fileContent;
                    const style = data.style;

                    if (!moleculeData || moleculeData.length === 0) {
                        console.error('Empty molecule data received');
                        return;
                    }

                    const format = file.name.endsWith('.pdb') ? 'pdb' : 'sdf';

                    try {
                        // Clear all previous models from the viewer
                        viewer.removeAllModels();

                        // Add the new model to the viewer
                        viewer.addModel(moleculeData, format);

                        // Automatically add missing hydrogens
                        viewer.addHydrogens();

                        // Apply the selected style
                        if (style === 'stick') {
                            viewer.setStyle({}, {stick: {colorscheme: 'Jmol', radius: 0.2}});
                        } else if (style === 'ball&stick') {
                            viewer.setStyle({}, {stick: {radius: 0.2}, sphere: {scale: 0.3}});
                        } else {
                            viewer.setStyle({}, {cartoon: {color: 'spectrum'}});
                        }

                        // Render the updated molecule view
                        viewer.zoomTo();
                        viewer.render();
                        console.log('Molecule rendered successfully');
                    } catch (err) {
                        console.error('Error rendering molecule:', err);
                    }
                })
                .catch(error => console.error('Error uploading file:', error));
            };

            // Read the file as plain text
            reader.readAsText(file);
        });
    </script>
</body>
</html>

