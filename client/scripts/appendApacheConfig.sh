  cat /etc/httpd/conf/httpd.conf /var/www/html/apacheConfig.conf > /etc/httpd/conf/result.conf
  mv /etc/httpd/conf/result.conf /etc/httpd/conf/httpd.conf
  rm /etc/httpd/conf/apacheConfig.conf

  service httpd restart
  