  #!/bin/bash

  echo "roda"
  cat /etc/httpd/conf/httpd.conf /var/www/html/apacheConfig.conf > /etc/httpd/conf/result.conf
  mv /etc/httpd/conf/result.conf /etc/httpd/conf/httpd.conf
  echo "ALOOWWWWW"
  rm /var/www/html/apacheConfig.conf

  service httpd restart
  