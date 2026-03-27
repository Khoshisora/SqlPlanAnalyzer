package org.analyzer.app.sqlplananalyzer.repository;

import org.analyzer.app.sqlplananalyzer.entity.QueryPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface QueryPlanRepository extends JpaRepository<QueryPlan, UUID> {


}
