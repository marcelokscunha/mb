package hello;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:8080")
@RepositoryRestResource(collectionResourceRel = "trips", path = "trips")
public interface TripsRepository extends PagingAndSortingRepository<Trip, Long> {
		List<Trip> findByUserId(@Param("userId") String userId);
}
