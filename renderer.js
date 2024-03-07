document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const fileDropArea = document.getElementById('fileDropArea');
    const encryptButton = document.getElementById('encryptButton');
    const decryptButton = document.getElementById('decryptButton');
    const outputDiv = document.getElementById('output');
    let password = ''; // Store the password for decryption

    fileInput.addEventListener('change', handleFileUpload);

    fileDropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        fileDropArea.classList.add('dragover');
    });

    fileDropArea.addEventListener('dragleave', () => {
        fileDropArea.classList.remove('dragover');
    });

    fileDropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        fileDropArea.classList.remove('dragover');
        const files = event.dataTransfer.files;
        handleFiles(files);
    });

    encryptButton.addEventListener('click', () => {
        password = document.getElementById('password').value; // Update the password for encryption
        const files = fileInput.files; // Get all selected files
    
        if (!password || files.length === 0) {
            console.error('Please enter a password and select files to encrypt.');
            return;
        }
    
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
    
            reader.onload = function () {
                const arrayBuffer = reader.result;
                const uint8Array = new Uint8Array(arrayBuffer); // Convert ArrayBuffer to Uint8Array
                const encryptedData = encryptFile(uint8Array, password);
                console.log('Encrypted data for ' + file.name + ': ' + encryptedData);
    
                // Create a download link for the encrypted file
                const encryptedBlob = new Blob([encryptedData], { type: 'text/plain' });
                const encryptedUrl = URL.createObjectURL(encryptedBlob);
                const encryptedLink = document.createElement('a');
                encryptedLink.href = encryptedUrl;
                encryptedLink.download = file.name + '_encrypted.txt';
                document.body.appendChild(encryptedLink);
                encryptedLink.click();
                document.body.removeChild(encryptedLink);
            };
    
            reader.readAsArrayBuffer(file);
        }
    });


  decryptButton.addEventListener('click', () => {
    const files = fileInput.files; // Get all selected files

    if (!password || files.length === 0) {
        console.error('Please enter a password and select files to decrypt.');
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function () {
            const arrayBuffer = reader.result;
            const uint8Array = new Uint8Array(arrayBuffer); // Convert ArrayBuffer to Uint8Array
            const decryptedData = decryptFile(uint8Array, password);
            console.log('Decrypted data for ' + file.name + ': ' + decryptedData);

            // Create a download link for the decrypted file
            const decryptedBlob = new Blob([decryptedData], { type: 'text/plain' });
            const decryptedUrl = URL.createObjectURL(decryptedBlob);
            const decryptedLink = document.createElement('a');
            decryptedLink.href = decryptedUrl;
            decryptedLink.download = file.name + '_decrypted.txt';
            document.body.appendChild(decryptedLink);
            decryptedLink.click();
            document.body.removeChild(decryptedLink);
        };

        reader.readAsText(file);
    }
});
    

    function handleFileUpload(event) {
        const files = event.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        // Handle uploaded or dropped files
        
        let fileNames = [];
        for (let i = 0; i < files.length; i++) {
            fileNames.push(files[i].name);
        }
        console.log('Files: ' + fileNames.join(', '));
    }

    function encryptFile(data, password) {
        const encryptedData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), password).toString();
        return encryptedData;
    }

    function decryptFile(data, password) {
        const decryptedData = CryptoJS.AES.decrypt(data, password).toString(CryptoJS.enc.Utf8);
        return decryptedData;
    }
});
