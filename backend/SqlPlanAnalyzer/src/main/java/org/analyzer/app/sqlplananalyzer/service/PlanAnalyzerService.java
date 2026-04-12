package org.analyzer.app.sqlplananalyzer.service;

import lombok.RequiredArgsConstructor;
import org.analyzer.app.sqlplananalyzer.dto.request.AnalyzeRequest;
import org.analyzer.app.sqlplananalyzer.exception.InvalidSqlException;
import org.analyzer.app.sqlplananalyzer.repository.QueryPlanRepository;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class PlanAnalyzerService {

    private final QueryPlanRepository queryPlanRepository;
    private final JdbcTemplate jdbcTemplate;
    private final StringRedisTemplate redisTemplate;

    public String getExecutionPlan(AnalyzeRequest request) {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUrl("jdbc:postgresql://" + request.host() + ":" + request.port() + "/" + request.database());
        dataSource.setUsername(request.username());
        dataSource.setPassword(request.password());

        JdbcTemplate dynamicJdbcTemplate = new JdbcTemplate(dataSource);

        String cleanSql = parseQuery(request.sql());

        if (!cleanSql.matches("(?i)^\\s*select[\\s\\S]+$")) {
            throw new InvalidSqlException("Only single SELECT queries are allowed!");
        }

        if (cleanSql.contains(";")) {
            throw new InvalidSqlException("Multiple queries or semicolons are not allowed!");
        }

        return dynamicJdbcTemplate.queryForObject(
                "EXPLAIN (FORMAT JSON, ANALYZE) " + cleanSql,
                String.class
        );
    }

    private String parseQuery(String sqlQuery) {
        sqlQuery = sqlQuery.strip();

        if (sqlQuery.endsWith(";")) {
            sqlQuery = sqlQuery.substring(0, sqlQuery.length() - 1);
        }

        return sqlQuery;
    }
}
