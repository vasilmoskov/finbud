package com.example.application.data;

import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;
import org.springframework.data.mongodb.core.index.Indexed;

@MappedSuperclass
public abstract class AbstractEntity<T> {

    @Id
    @Indexed(unique = true)
    private String id;

    @Version
    private int version;

    public String getId() {
        return id;
    }

    public T setId(String id) {
        this.id = id;
        return (T) this;
    }

    public int getVersion() {
        return version;
    }

    public T setVersion(int version) {
        this.version = version;
        return (T) this;
    }

    @Override
    public int hashCode() {
        if (getId() != null) {
            return getId().hashCode();
        }
        return super.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof AbstractEntity that)) {
            return false; // null or not an AbstractEntity class
        }
        if (getId() != null) {
            return getId().equals(that.getId());
        }
        return super.equals(that);
    }
}
