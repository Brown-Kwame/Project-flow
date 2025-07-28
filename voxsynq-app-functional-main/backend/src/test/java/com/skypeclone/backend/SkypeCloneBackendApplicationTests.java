package com.skypeclone.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SkypeCloneBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}


//package com.skypeclone.backend;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.boot.autoconfigure.EnableAutoConfiguration; // IMPORT THIS
//import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration; // IMPORT THIS
//import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration; // IMPORT THIS
//import org.springframework.boot.test.context.SpringBootTest;
//
//@SpringBootTest
//@EnableAutoConfiguration(exclude={ // ADD THIS ANNOTATION TO EXCLUDE DB CONFIG
//		DataSourceAutoConfiguration.class,
//		HibernateJpaAutoConfiguration.class
//})
//class SkypeCloneBackendApplicationTests {
//
//	@Test
//	void contextLoads() {
//		// This test should now load the Spring context WITHOUT trying to
//		// set up a DataSource or JPA/Hibernate.
//		// If it passes, the problem is 100% related to database setup during tests.
//	}
//
//}