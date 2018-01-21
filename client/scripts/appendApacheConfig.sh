  #!/bin/bash
  
  sudo cat /etc/httpd/conf/httpd.conf /var/www/html/apacheConfig.conf > /etc/httpd/conf/result.conf
  sudo mv /etc/httpd/conf/result.conf /etc/httpd/conf/httpd.conf
  
  sudo rm /var/www/html/apacheConfig.conf -y

  sudo service httpd restart
  