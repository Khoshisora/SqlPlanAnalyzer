package org.analyzer.app.sqlplananalyzer.service;

import lombok.RequiredArgsConstructor;
import org.analyzer.app.sqlplananalyzer.entity.QueryPlan;
import org.analyzer.app.sqlplananalyzer.exception.InvalidSqlException;
import org.analyzer.app.sqlplananalyzer.repository.QueryPlanRepository;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PlanAnalyzerService {

    private final QueryPlanRepository queryPlanRepository;
    private final JdbcTemplate jdbcTemplate;
    private final StringRedisTemplate redisTemplate;

    public String getExecutionPlan(String sqlQuery) {
        String cleanSql = parseQuery(sqlQuery);

        if (!cleanSql.matches("(?i)^\\s*select[\\s\\S]+$")) {
            throw new InvalidSqlException("Only single SELECT queries are allowed!");
        }

        if (cleanSql.contains(";")) {
            throw new InvalidSqlException("Multiple queries or semicolons are not allowed!");
        }

        String jsonPlan = jdbcTemplate.queryForObject(
                "EXPLAIN (ANALYZE, FORMAT JSON) " + cleanSql,
                String.class
        );

        QueryPlan plan = QueryPlan.builder()
                .sqlQuery(cleanSql)
                .jsonPlan(jsonPlan)
                .createdAt(LocalDateTime.now())
                .build();

        queryPlanRepository.save(plan);

        return jsonPlan;
    }

    private String parseQuery(String sqlQuery) {
        sqlQuery = sqlQuery.strip();

        if (sqlQuery.endsWith(";")) {
            sqlQuery = sqlQuery.substring(0, sqlQuery.length() - 1);
        }

        return sqlQuery;
    }
}
