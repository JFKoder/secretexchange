
## In-Browser File Encryption and Decryption

you should keep yor secrets, but, what if you have to share a secret? Like a SSL Certifikate, or a Config file?
this service will take care about.

No information will leave the browser unencrypted

how to run it local on NodeJS:

    git clone https://github.com/JFKoder/secretexchange.git
    npm install
    npm start

TODO: 
	☐	max Filesize 
	☐	editable Lifetime of files
	☐	InMemory storage
	☐	Limit how can generate links (by Key, invitation Link, or so ...)
	☐	Multi-File Upload
	☐	Shred Files instead of Unlink/remove
	☐	Run in Docker
	🗷	InBrowser Encryption and decryption

This program demonstrates a mechanism for securely encrypting and decrypting files entirely in the user's browser. It involves two main components:

1.  **File Upload with Encryption**: The user selects a file to upload. Before uploading, the file is encrypted using AES-GCM encryption directly in the browser. The encryption key and initialization vector (IV) are generated and displayed to the user in Base64 format. The user can then copy this information to use for decryption.
    
2.  **File Download with Decryption**: The user enters the combined key and IV in Base64 format, along with the file name. The program fetches the encrypted file from the server, decrypts it in the browser using the provided key, and allows the user to download the decrypted file.
    

### Components

1.  **FileUploadService**:
    
    -   Encrypts the selected file using AES-GCM.
    -   Uploads the encrypted file to the server.
    -   Returns the Base64-encoded key to the user.
2.  **EncryptionDownloadService**:
    
    -   Fetches the encrypted file from the server.
    -   Decrypts the file using the provided key.
    -   Handles response headers from the server.
3.  **DecryptFileComponent**:
    
    -   Takes user input for the key and file name.
    -   Fetches and decrypts the encrypted file.
    -   Handles and displays any errors.

### Usage

1.  **Encrypt and Upload**:
    
    -   User selects a file to upload.
    -   The file is encrypted in the browser and uploaded to the server.
    -   The key is displayed to the user in Base64 format.
2.  **Decrypt and Download**:
    
    -   User provides the key and file name.
    -   The encrypted file is fetched from the server.
    -   The file is decrypted in the browser.
    -   The decrypted file is made available for download.

This program ensures that files are securely encrypted before upload and can only be decrypted by the user with the correct key, maintaining the confidentiality and integrity of the data. All encryption and decryption operations are performed in the browser, ensuring that sensitive data never leaves the user's device in an unencrypted form.
