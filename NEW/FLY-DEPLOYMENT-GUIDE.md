exit
# Go back to root where logo.png definitely exists
cd ..

# Copy the working Dockerfile
cp NEW/Dockerfile .
cp NEW/fly.toml .
cp NEW/nginx.conf .

# Deploy from root
fly deploy --app blowincoldac
