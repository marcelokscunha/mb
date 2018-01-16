package hello;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.bind.annotation.CrossOrigin;

// @CrossOrigin(origins = "http://localhost:8080")

@Entity
public class Trip {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;

	private String userId;

	public void setUserId(String userId) {
        this.userId = userId;
    }

	public String getUserId() {
		return userId;
	}

	private String content;

	public void setContent(String content) {
        this.content = content;
    }

	public String getContent() {
		return content;
	}

}

