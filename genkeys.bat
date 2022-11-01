@echo off
set openssl="C:\Program Files\Git\usr\bin\openssl.exe"
rem private key
echo genkeys: Generating public key
%openssl% genpkey -algorithm RSA ^
    -pkeyopt rsa_keygen_bits:2048 ^
    -pkeyopt rsa_keygen_pubexp:65537 | %openssl% pkcs8 -topk8 -nocrypt -outform pem > private.pem
rem public key
echo genkeys: Generating private key
%openssl% pkey -pubout -inform pem -outform pem ^
    -in private.pem ^
    -out public.pem