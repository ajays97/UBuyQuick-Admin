const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

var serviceAccount = {
    type: "service_account",
    project_id: "ubuyquick-app",
    private_key_id: "8dee0af5918f05b917e9c7d8e84afbcac056bce0",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCy+3XrifzJ3bG9\n3V2C8xuUq8swONBs5MmrPA78d6l6T1rL4wltKbYpheCh5B2NpldUqCfpYNnMSsWl\n2tg2P/Lfja/3IX4Ym7D6hVLjP3DtbnRu7HnkAhU3A6g9bgT7qiBFdRqh+d0kj45v\nGnkG0TYMKzEmr4jZNu3zM2cOW97PIufWZuSxV6HxjoYOBE1Ek11gdcLkTzoMqOI7\nGdm8Kruu5n/sJRdebJGu+onEh/E2XDfeuxdZdr/doCSy9hhLXIrqCVxgSwR8N2LC\n/kZJrpb8oQur8nZFf0AGwFXzi53vSG9mNrWm1BvJUl7R3EdksTDBkyV/Di0ablFI\nFIO0BQTJAgMBAAECggEAA463OC5q033YMrKH0Wqg25aDEEMu1F1DS2ejEh5URGm3\nn6oUdcKgm+hs77bTpg0+euCpQ2yhA5wgW9Sy27gvbQVZUCeOpLFShhY4kKsCBPwf\nLRW+8frfHlPwqADr8S8fW1YRqJLJdBi03202pt2pbfo9TLwsM4oRlnYI+Dp3/iS2\nU0dCchmufNYcMycEbxYde+TjwPkOs6GrT+tVaAu2qKhwlc+l6L3t302ZGG4yFc3Y\nVJoxwuu1oCeukV6EgVd7pr5T/uun9GgtEJ2M9pPKuJA+JCeN+5HwIdoITuRx6ePx\nof7CHLkcl/Ak6nxJPo6XCv+HbzPdZHWjxRoUuax1AQKBgQDgq86qsGmxbCG5lek8\n3F+VH5ScM4Nxc8ubjqxjCTf+0WmqI2JE48g2tHrSzt9NhazLycjqi8PyzlG9UqWr\nD27VvQJdpqbkwVsDkAUZhrCaFlAzbG7VQs/0UcnV68gqIEKcpBwNF2gucVNXMTqF\nNJ7EJCSgzoa5txgR950J5xNzyQKBgQDL8K0pZm9Pak9JwI6BnD9dC+p7TC/naiQc\nOyaTlmdcRfJPXC79vIjeT4biHberrJJoeyJ/hLgfaAbMxhLKkAT/WDfPMM3vUq0c\n407xb0unyHm7KGiOGEssy5rQU3l/lV7LxNoziFPEED3yZtaHoRUhpb7QAwkwQnxz\nfmKH06OJAQKBgENkBYe5htqLPsp2JxH0YE9Qu7jm0sSTIT213AuQ1lT+55z7JBzZ\n3lJabIUTPHP6Zsxx6GxCJDKOpIIPalYXOP2vxiflNyZiwTQeXQk9F3gAvWnPWqdp\ndQsqBUq/gLjyGEj4CNn8bWmQ4JjE0XLnR8A5vyrlCBBo1TV+eoJf57vRAoGBAJ2N\nU9l1/2w0zwhFMFLFKNZzTDTwyNlY0IjW0ZiXS0an6uiQaOUxb/N/MM8i8jA4Y+s/\npYkqOSxaK1ardvzygknaF1ODerT3BDIbEXPH7YSzhgem0g9kiT8UFIf41RZRiSiW\n7ZN+MGh5u8G23Olu8mpKJ71/euvDkW2QKAKS5/YBAoGAEPCn7Z2z9bRGuxi29wY/\nMjjBIPUjJmFp0CJwiL4hWf7aOKMuZLFagOUizTtd8A8M3MhcgwUH5vQaVf3jVHYn\nl/un7nT7MMYufSdDQu1V3ixLS9uhOB9UteIS5vN6OrIdPlVQZ+kcyOI0e1WKZ6IZ\nB2ioO8/ZhmF0gOjmFreyoIw=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-moe8b@ubuyquick-app.iam.gserviceaccount.com",
    client_id: "109759440414076638727",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://accounts.google.com/o/oauth2/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-moe8b%40ubuyquick-app.iam.gserviceaccount.com"
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function (req, res) {
    res.sendFile('index.html', {root: __dirname+'/views'});
});

app.post('/insertProduct', function(req, res) {
    console.log(req.body);
    var data = req.body;

    var product = {
        product_name: data.product_name,
        product_image_url: data.product_image_url,
        product_description: data.product_description,
        product_mrp: data.product_mrp,
        product_measure: data.product_measure.toLowerCase(),
        category: data.category.toLowerCase().split(' ').join('_'),
        sub_category: data.sub_category.toLowerCase().split(' ').join('_'),
        sub_sub_category: data.micro_category.toLowerCase().split(' ').join('_')
    };

    if (data.veg === 'on') {
        product.product_type = 'VEG';
    } else {
        product.product_type = 'NONVEG';
    }

    var addProduct = db.collection('products_master').add(product).then(function (ref) {
        db.collection('product_categories').doc(product.category).collection(product.sub_category).doc(ref.id).set({
            product_name: product.product_name,
            product_image_url: product.product_image_url,
            product_description: product.product_description,
            product_measure: product.product_measure,
            product_mrp: product.product_mrp,
            sub_sub_category: product.sub_sub_category,
            product_id: ref.id
        });
    });

    res.redirect('/');
});

app.listen(process.env.PORT || 80, function (err) {
    if (err) throw err;
    console.log("Magic happens on port 80...");
});