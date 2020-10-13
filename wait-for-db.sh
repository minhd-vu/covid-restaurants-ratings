while [ "$(docker inspect -f '{{.State.Health.Status}}' mysqldb)" != "healthy" ];
do
    sleep 1
done