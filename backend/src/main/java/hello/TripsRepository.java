package hello;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "trips", path = "trips")
public interface TripsRepository extends PagingAndSortingRepository<Trip, Long> {
		List<Trip> findByUserId(@Param("userId") String userId);
}
