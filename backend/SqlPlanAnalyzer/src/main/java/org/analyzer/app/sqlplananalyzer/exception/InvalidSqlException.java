package org.analyzer.app.sqlplananalyzer.exception;

public class InvalidSqlException extends RuntimeException {
    public InvalidSqlException(String message) {
        super(message);
    }
}
